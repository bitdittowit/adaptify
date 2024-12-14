export type InitialData<T> = T extends unknown[] ? [] : null;

export interface ApiResult<T> {
    data: T | InitialData<T>;
    error: Error | null;
    loading: boolean;
}
