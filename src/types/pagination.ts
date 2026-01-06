export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PagePaginationResult<T> {
  data: T[];
  total: number;
}
