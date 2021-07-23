import { IBoard } from "../models/board";
import { environmentVariables } from "../environmentVariables";
import Axios from "axios";

export interface IBoardApi {
    getBoardsForCompany(companyId: string): Promise<IBoard[]>;
    createBoardForCompany(
        companyId: string,
        boardName: string,
        boardDescription: string
    ): Promise<IBoard>;
    deleteBoardForCompany(companyId: string, boardId: string): Promise<void>;
}

export class BoardApi implements IBoardApi {
    public async getBoardsForCompany(companyId: string) {
        const axiosResponse = await Axios.get(
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
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/board`,
            {
                companyId,
                boardName,
                boardDescription,
            }
        );
        return axiosResponse.data as IBoard;
    }

    public async deleteBoardForCompany(
        companyId: string,
        boardId: string
    ): Promise<void> {
        await Axios.delete(
            `${environmentVariables.baseAuthenticatedApiUrl}/deleteBoardForCompany`,
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );
    }
}
