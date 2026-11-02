type QueryValue = string | number | boolean;
type QueryParams = Record<string, QueryValue>;

type HttpMethod = 'GET' | 'POST';

type ResponseCallback<TResponse> = (data: TResponse) => void;

interface GetRequest {
    endpoint: string;
    options?: QueryParams;
}

enum HttpErrorStatus {
    Unauthorized = 401,
    NotFound = 404,
}

class Loader {
    constructor(
        private readonly baseLink: string,
        private readonly options: QueryParams
    ) {}

    getResp<TResponse>(
        { endpoint, options = {} }: GetRequest,
        callback: ResponseCallback<TResponse> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', endpoint, callback, options);
    }

    errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === HttpErrorStatus.Unauthorized || res.status === HttpErrorStatus.NotFound) {
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            }
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(options: QueryParams, endpoint: string): string {
        const urlOptions: QueryParams = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    load<TResponse>(
        method: HttpMethod,
        endpoint: string,
        callback: ResponseCallback<TResponse>,
        options: QueryParams = {}
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json() as Promise<TResponse>)
            .then((data) => callback(data))
            .catch((err: unknown) => console.error(err));
    }
}

export default Loader;
