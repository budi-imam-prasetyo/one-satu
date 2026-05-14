export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}
