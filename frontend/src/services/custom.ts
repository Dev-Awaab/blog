export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    next?: {
      page: number;
      size: number;
    };
    previous?: {
      page: number;
      size: number;
    };
    current_page?: number;
    size: number;
    total: number;
  };
}
