export interface IDiscountCode {
    id: string;
    percentage: number; // 1 - 100
    limit: number;
    used: number;
    created: string;
}
