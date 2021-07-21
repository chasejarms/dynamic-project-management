import { IBoard } from "../models/board";
import Axios from "axios";
import { environmentVariables } from "../environmentVariables";

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
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/boards`,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
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
            },
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
            }
        );
        return axiosResponse.data as IBoard;
    }
}
