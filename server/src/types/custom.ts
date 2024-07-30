export type UnknownObject = Record<string, any>;

export interface AuditTrail {
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export type PaginationParam = {
  page?: number;
  limit?: number;
};

export type Search = {
  query?: string;
};

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
