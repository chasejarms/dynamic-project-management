export interface IPaginatedResponse<T> {
    data: T[];
    totalItems: number;
    page: number;
    pageSize: number;
}
