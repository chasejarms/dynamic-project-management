import { IColumn } from "../models/column";
import { environmentVariables } from "../environmentVariables";
import Axios from "axios";

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
