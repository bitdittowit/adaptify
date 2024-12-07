export interface ApiResult<T> {
  data: T | null;
  error: Error | null;
};
