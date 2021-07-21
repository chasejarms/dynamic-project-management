import { ITicket } from "../models/ticket";
import { ITicketCreateRequest } from "../models/ticket/ticketCreateRequest";
import { environmentVariables } from "../environmentVariables";
import { TicketType } from "../models/ticket/ticketType";
import { IGetDoneTicketsResponse } from "../models/getDoneTicketsResponse";
import { ITicketUpdateRequest } from "../models/ticketUpdateRequest";
import { axiosInstance } from "../hooks/useAxiosInterceptor";

export interface ITicketsApi {
    createTicket(
        companyId: string,
        boardId: string,
        ticketCreateRequest: ITicketCreateRequest
    ): Promise<ITicket>;

    getInProgressTickets(
        companyId: string,
        boardId: string
    ): Promise<ITicket[]>;

    updateTicketColumn(
        companyId: string,
        boardId: string,
        ticketId: string,
        updatedColumnId: string
    ): Promise<void>;

    deleteTicket(
        companyId: string,
        boardId: string,
        ticketId: string,
        ticketType: TicketType
    ): Promise<void>;

    markTicketAsDone(
        companyId: string,
        boardId: string,
        ticketId: string,
        ticketType: TicketType
    ): Promise<void>;

    getDoneTicketPaginated(
        companyId: string,
        boardId: string,
        lastEvaluatedKey?: string
    ): Promise<IGetDoneTicketsResponse>;

    getTicketInformationById(
        companyId: string,
        boardId: string,
        ticketId: string
    ): Promise<ITicket>;

    updateTicketInformation(
        ticketItemId: string,
        ticketBelongsTo: string,
        ticketUpdateRequest: ITicketUpdateRequest
    ): Promise<ITicket>;

    getBacklogTickets(companyId: string, boardId: string): Promise<ITicket[]>;

    moveNonInProgressTicketToInProgress(
        companyId: string,
        boardId: string,
        ticketId: string,
        columnId: string
    ): Promise<void>;
}

export class TicketsApi implements ITicketsApi {
    public async createTicket(
        companyId: string,
        boardId: string,
        ticketCreateRequest: ITicketCreateRequest
    ) {
        const axiosResponse = await axiosInstance.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/createTicketForBoard`,
            {
                ticket: ticketCreateRequest,
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
        const data = axiosResponse.data as {
            ticket: ITicket;
        };
        return data.ticket;
    }

    public async getInProgressTickets(companyId: string, boardId: string) {
        const axiosResponse = await axiosInstance.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getInProgressTicketsForBoard`,
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
            tickets: ITicket[];
        }).tickets;
    }

    public async updateTicketColumn(
        companyId: string,
        boardId: string,
        ticketId: string,
        updatedColumnId: string
    ): Promise<void> {
        await axiosInstance.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateColumnOnTicket`,
            {
                columnId: updatedColumnId,
            },
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                    ticketId,
                },
            }
        );
    }

    public async deleteTicket(
        companyId: string,
        boardId: string,
        ticketId: string,
        ticketType: TicketType
    ): Promise<void> {
        await axiosInstance.delete(
            `${environmentVariables.baseAuthenticatedApiUrl}/deleteTicket`,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                    ticketId,
                    ticketType,
                },
            }
        );
    }

    public async markTicketAsDone(
        companyId: string,
        boardId: string,
        ticketId: string,
        ticketType: TicketType
    ): Promise<void> {
        await axiosInstance.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/markTicketAsDone`,
            {},
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                    ticketId,
                    ticketType,
                },
            }
        );
    }

    public async getDoneTicketPaginated(
        companyId: string,
        boardId: string,
        lastEvaluatedKey?: string
    ): Promise<IGetDoneTicketsResponse> {
        const axiosResponse = await axiosInstance.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getDoneTickets`,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                    limit: 20,
                    lastEvaluatedKey,
                },
            }
        );

        return axiosResponse.data as IGetDoneTicketsResponse;
    }

    public async getTicketInformationById(
        companyId: string,
        boardId: string,
        ticketId: string
    ): Promise<ITicket> {
        const axiosResponse = await axiosInstance.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getTicketInformationById`,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                    ticketId,
                },
            }
        );

        return axiosResponse.data as ITicket;
    }

    public async updateTicketInformation(
        ticketItemId: string,
        ticketBelongsTo: string,
        ticketUpdateRequest: ITicketUpdateRequest
    ): Promise<ITicket> {
        const axiosResponse = await axiosInstance.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateTicketForBoard`,
            ticketUpdateRequest,
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    itemId: ticketItemId,
                    belongsTo: ticketBelongsTo,
                },
            }
        );

        return axiosResponse.data as ITicket;
    }

    public async getBacklogTickets(
        companyId: string,
        boardId: string
    ): Promise<ITicket[]> {
        const axiosResponse = await axiosInstance.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getBacklogTicketsForBoard`,
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
            tickets: ITicket[];
        }).tickets;
    }

    public async moveNonInProgressTicketToInProgress(
        companyId: string,
        boardId: string,
        ticketId: string,
        columnId: string
    ) {
        await axiosInstance.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/moveNonInProgressTicketToInProgress`,
            {},
            {
                headers: {
                    AuthHeader: `${localStorage.getItem("token") || ""}`,
                },
                params: {
                    companyId,
                    boardId,
                    ticketId,
                    columnId,
                },
            }
        );
    }
}
