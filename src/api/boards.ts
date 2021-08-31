import { IBoard } from "../models/board";
import { environmentVariables } from "../environmentVariables";
import Axios from "axios";
import { BoardPriorityType } from "../models/boardPriorityType";

export interface IBoardApi {
    getBoardsForCompany(companyId: string): Promise<IBoard[]>;
    createBoardForCompany(
        companyId: string,
        boardName: string,
        boardDescription: string,
        priorityType: BoardPriorityType
    ): Promise<{
        id: string;
        name: string;
        description: string;
    }>;
    deleteBoardForCompany(companyId: string, boardId: string): Promise<void>;
    getBoardForCompany(companyId: string, boardId: string): Promise<IBoard>;
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
        boardDescription: string,
        priorityType: BoardPriorityType
    ) {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/board`,
            {
                companyId,
                boardName,
                boardDescription,
                priorityType,
            }
        );
        return axiosResponse.data as {
            id: string;
            name: string;
            description: string;
        };
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

    public async getBoardForCompany(
        companyId: string,
        boardId: string
    ): Promise<IBoard> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getBoardForCompany`,
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );

        return axiosResponse.data as IBoard;
    }
}
