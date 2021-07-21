import { IBoard } from "../models/board";
import { environmentVariables } from "../environmentVariables";
import { axiosInstance } from "../hooks/useAxiosInterceptor";

export interface IBoardApi {
    getBoardsForCompany(companyId: string): Promise<IBoard[]>;
    createBoardForCompany(
        companyId: string,
        boardName: string,
        boardDescription: string
    ): Promise<IBoard>;
}

export class BoardApi implements IBoardApi {
    public async getBoardsForCompany(companyId: string) {
        const axiosResponse = await axiosInstance.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/boards`,
            {
                params: {
                    companyId,
                },
            }
        );
        const data = axiosResponse.data as {
            items: IBoard[];
        };
        return data.items;
    }

    public async createBoardForCompany(
        companyId: string,
        boardName: string,
        boardDescription: string
    ) {
        const axiosResponse = await axiosInstance.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/board`,
            {
                companyId,
                boardName,
                boardDescription,
            }
        );
        return axiosResponse.data as IBoard;
    }
}
