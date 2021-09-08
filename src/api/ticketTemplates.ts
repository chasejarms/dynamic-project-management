import { ITicketTemplate } from "../models/ticketTemplate";
import { environmentVariables } from "../environmentVariables";
import { ITicketTemplateCreateRequest } from "../models/ticketTemplate/ticketTemplateCreateRequest";
import Axios from "axios";
import { ITicketTemplatePutRequest } from "../models/ticketTemplate/ticketTemplatePutRequest";

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

    updateTicketTemplateForBoard(
        companyId: string,
        boardId: string,
        ticketTemplateId: string,
        ticketTemplateRequest: ITicketTemplatePutRequest
    ): Promise<void>;
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
        ticketTemplateRequest: ITicketTemplateCreateRequest
    ): Promise<ITicketTemplate> {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/createTicketTemplateForBoard`,
            {
                ticketTemplate: ticketTemplateRequest,
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

    public async updateTicketTemplateForBoard(
        companyId: string,
        boardId: string,
        ticketTemplateId: string,
        ticketTemplateRequest: ITicketTemplatePutRequest
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateTicketTemplateForBoard`,
            {
                ...ticketTemplateRequest,
            },
            {
                params: {
                    companyId,
                    boardId,
                    ticketTemplateId,
                },
            }
        );
    }
}
