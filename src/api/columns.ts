import { IColumn } from "../models/column";
import Axios from "axios";
import { environmentVariables } from "../environmentVariables";

export interface IColumnsApi {
    getColumns(companyId: string, boardId: string): Promise<IColumn[]>;
    updateColumns(
        companyId: string,
        boardId: string,
        columns: IColumn[]
    ): Promise<IColumn[]>;
}

export class ColumnsApi implements IColumnsApi {
    public async getColumns(
        companyId: string,
        boardId: string
    ): Promise<IColumn[]> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getBoardColumnInformation`,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                },
            }
        );
        return (axiosResponse.data as {
            columns: IColumn[];
        }).columns;
    }

    public async updateColumns(
        companyId: string,
        boardId: string,
        columns: IColumn[]
    ) {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateBoardColumnInformation`,
            {
                columns,
            },
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                },
            }
        );
        const data = axiosResponse.data as { columns: IColumn[] };
        return data.columns;
    }
}
