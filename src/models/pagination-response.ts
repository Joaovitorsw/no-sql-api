export type PaginationResponse<T> = {
  page: number;
  size: number;
  total: number;
  items: T[];
};
export type PaginationRequest<T> = {
  [key in keyof T]: T[key];
} & {
  page: number;
  size: number;
  sort: string;
};
