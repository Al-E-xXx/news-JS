import type { ApiErrorResponse } from '../../models/response';
import { ApiResponseStatus } from '../../models/response';
import TimeoutSignal from './timeoutSignal';

type QueryValue = string | number | boolean;
type QueryParams = Record<string, QueryValue>;

type HttpMethod = 'GET' | 'POST';

export type ResponseCallback<TResponse> = (data: TResponse) => void;

interface GetRequest {
    endpoint: string;
    options?: QueryParams;
}

export class LoadError extends Error {
    public constructor(
        message: string,
        public readonly status?: number,
        public readonly code?: string
    ) {
        super(message);
        this.name = 'LoadError';
    }
}

const REQUEST_TIMEOUT_MS = 8_000;

enum HttpErrorStatus {
    Unauthorized = 401,
    NotFound = 404,
}

class Loader {
    public constructor(
        private readonly baseLink: string,
        private readonly options: Readonly<QueryParams>
    ) {}

    public getResp<TResponse>(
        { endpoint, options = {} }: GetRequest,
        callback: ResponseCallback<TResponse> = () => {
            console.error('No callback for GET response');
        }
    ): Promise<void> {
        return this.load('GET', endpoint, callback, options);
    }

    public async errorHandler(res: Response): Promise<void> {
        if (res.ok) {
            return;
        }

        const apiError = await this.readApiError(res);

        if (res.status === HttpErrorStatus.Unauthorized || res.status === HttpErrorStatus.NotFound) {
            console.log(`Sorry, but there is ${res.status} error - check the request and the api key`);
        }

        throw new LoadError(
            apiError ? apiError.message : `Request failed with status ${res.status}`,
            res.status,
            apiError?.code
        );
    }

    private async readApiError(res: Response): Promise<ApiErrorResponse | null> {
        try {
            const body: unknown = await res.json();

            return isApiErrorResponse(body) ? body : null;
        } catch {
            return null;
        }
    }

    private makeQuery(options: QueryParams): string {
        const queryParams: string[] = [];

        for (const key in options) {
            queryParams.push(`${key}=${encodeURIComponent(String(options[key]))}`);
        }

        return queryParams.length === 0 ? '' : `?${queryParams.join('&')}`;
    }

    private async load<TResponse>(
        method: HttpMethod,
        endpoint: string,
        callback: ResponseCallback<TResponse>,
        options: QueryParams
    ): Promise<void> {
        const url = `${this.baseLink}${endpoint}${this.makeQuery({ ...this.options, ...options })}`;
        const timeout = new TimeoutSignal(REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: method === 'POST' ? JSON.stringify({ ...this.options, ...options }) : null,
                signal: timeout.signal,
            });

            await this.errorHandler(response);
            callback((await response.json()) as TResponse);
        } catch (error) {
            if (error instanceof LoadError) {
                throw error;
            }

            const reason = timeout.timedOut
                ? `Request timed out after ${REQUEST_TIMEOUT_MS} ms`
                : 'Request failed: server is not reachable';
            console.error(`Failed to load ${url}`, reason);
            throw new LoadError(reason);
        } finally {
            timeout.dispose();
        }
    }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const candidate: Partial<ApiErrorResponse> = value;

    return (
        candidate.status === ApiResponseStatus.Error &&
        typeof candidate.code === 'string' &&
        typeof candidate.message === 'string'
    );
}

export default Loader;
