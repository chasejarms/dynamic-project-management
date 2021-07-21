import { IColumn } from "../models/column";
import { environmentVariables } from "../environmentVariables";
import { axiosInstance } from "../hooks/useAxiosInterceptor";

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
        const axiosResponse = await axiosInstance.get(
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
        const axiosResponse = await axiosInstance.post(
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
