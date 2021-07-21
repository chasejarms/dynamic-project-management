import { IPaginatedResponse } from "../models/paginatedResponse";
import { IDiscountCode } from "../models/discountCode";

export interface IDiscountCodesApi {
    getCodes: (
        page: number,
        pageSize: number
    ) => Promise<IPaginatedResponse<IDiscountCode>>;

    createCode: (
        id: string,
        percentage: number,
        limit: number
    ) => Promise<IDiscountCode>;
}

const data: IDiscountCode[] = [];
for (let i = 1; i <= 100; i++) {
    data.push({
        id: i.toString(),
        percentage: i,
        limit: i % 4 || 1,
        used: i % 4,
        created: new Date().toISOString(),
    });
}

export class DiscountCodesApi implements IDiscountCodesApi {
    public getCodes(page: number, pageSize: number) {
        const startingIndex = page * pageSize;
        const slicedData = data.slice(startingIndex, startingIndex + pageSize);

        const paginatedResponse: IPaginatedResponse<IDiscountCode> = {
            page,
            pageSize,
            totalItems: data.length,
            data: slicedData,
        };

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(paginatedResponse);
            }, 2000);
        }) as Promise<IPaginatedResponse<IDiscountCode>>;
    }

    public createCode(id: string, percentage: number, limit: number) {
        const discountCode: IDiscountCode = {
            id,
            percentage,
            limit,
            used: 0,
            created: new Date().toISOString(),
        };

        data.push(discountCode);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(discountCode);
            }, 2000);
        }) as Promise<IDiscountCode>;
    }
}
