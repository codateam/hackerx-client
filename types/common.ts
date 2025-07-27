export interface ResponseType<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
