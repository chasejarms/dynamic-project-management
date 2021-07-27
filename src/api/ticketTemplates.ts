import { ITicketTemplate } from "../models/ticketTemplate";
import { environmentVariables } from "../environmentVariables";
import { ITicketTemplateCreateRequest } from "../models/ticketTemplate/ticketTemplateCreateRequest";
import Axios from "axios";

export interface ITicketTemplatesApi {
    getTicketTemplatesForBoard(
        companyId: string,
        boardId: string
    ): Promise<ITicketTemplate[]>;

    deleteTicketTemplateForBoard(
        copmanyId: string,
        boardId: string,
        ticketTemplateId: string
    ): Promise<void>;

    createTicketTemplateForBoard(
        companyId: string,
        boardId: string,
        ticketTemplateRequest: ITicketTemplateCreateRequest
    ): Promise<ITicketTemplate>;

    getTicketTemplateForBoard(
        companyId: string,
        boardId: string,
        ticketTemplateId: string
    ): Promise<ITicketTemplate>;
}

export class TicketTemplatesApi implements ITicketTemplatesApi {
    public async getTicketTemplatesForBoard(
        companyId: string,
        boardId: string
    ): Promise<ITicketTemplate[]> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getTicketTemplatesForBoard`,
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );

        return (axiosResponse.data as {
            items: ITicketTemplate[];
        }).items;
    }

    public async deleteTicketTemplateForBoard(
        companyId: string,
        boardId: string,
        ticketTemplateId: string
    ): Promise<void> {
        await Axios.delete(
            `${environmentVariables.baseAuthenticatedApiUrl}/deleteTicketTemplateForBoard`,
            {
                params: {
                    companyId,
                    boardId,
                    ticketTemplateId,
                },
            }
        );
    }

    public async createTicketTemplateForBoard(
        companyId: string,
        boardId: string,
        ticketTemplateCreateRequest: ITicketTemplateCreateRequest
    ): Promise<ITicketTemplate> {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/createTicketTemplateForBoard`,
            {
                ticketTemplate: ticketTemplateCreateRequest,
            },
            {
                params: {
                    companyId,
                    boardId,
                },
            }
        );

        return (axiosResponse.data as {
            ticketTemplate: ITicketTemplate;
        }).ticketTemplate;
    }

    public async getTicketTemplateForBoard(
        companyId: string,
        boardId: string,
        ticketTemplateId: string
    ): Promise<ITicketTemplate> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getTicketTemplateForBoard`,
            {
                params: {
                    companyId,
                    boardId,
                    ticketTemplateId,
                },
            }
        );

        return axiosResponse.data as ITicketTemplate;
    }
}
