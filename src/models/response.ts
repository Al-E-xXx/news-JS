import type { Article } from './article';
import type { Source } from './source';

export enum ApiResponseStatus {
    Ok = 'ok',
    Error = 'error',
}

export interface SourcesResponse {
    status: ApiResponseStatus;
    totalResults: number;
    sources: Source[];
}

export interface EverythingResponse {
    status: ApiResponseStatus;
    totalResults: number;
    page?: number;
    pageSize?: number;
    articles: Article[];
}

export interface ApiErrorResponse {
    status: ApiResponseStatus;
    code: string;
    message: string;
}

export type ApiResponse = SourcesResponse | EverythingResponse;
