import { ITicket } from "../models/ticket";
import { ITicketCreateRequest } from "../models/ticket/ticketCreateRequest";
import { environmentVariables } from "../environmentVariables";
import { TicketType } from "../models/ticket/ticketType";
import { IGetDoneTicketsResponse } from "../models/getDoneTicketsResponse";
import { ITicketUpdateRequest } from "../models/ticketUpdateRequest";
import Axios from "axios";
import { IFileForTicket } from "../models/fileForTicket";
import { ICreateUploadTicketResponse } from "../models/createUploadTicketResponse";
import { signedUrlReplace } from "../utils/signedUrlReplace";

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

    moveNonBacklogTicketToBacklog(
        companyId: string,
        boardId: string,
        ticketId: string
    ): Promise<void>;

    createUploadTicketImageSignedUrls(
        companyId: string,
        boardId: string,
        ticketId: string,
        files: {
            name: string;
        }[]
    ): Promise<ICreateUploadTicketResponse>;

    getTicketFilesWithSignedUrls(
        companyId: string,
        boardId: string,
        ticketId: string
    ): Promise<IFileForTicket[]>;

    deleteTicketFile(
        companyId: string,
        boardId: string,
        ticketId: string,
        fileName: string
    ): Promise<void>;

    getDownloadFileSignedUrl(
        companyId: string,
        boardId: string,
        ticketId: string,
        fileName: string
    ): Promise<string>;

    setAssignedToTicketField(
        companyId: string,
        boardId: string,
        ticketId: string,
        assignedTo:
            | ""
            | {
                  userId: string;
                  name: string;
              }
    ): Promise<void>;
}

export class TicketsApi implements ITicketsApi {
    public async createTicket(
        companyId: string,
        boardId: string,
        ticketCreateRequest: ITicketCreateRequest
    ) {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/createTicketForBoard`,
            {
                ticket: ticketCreateRequest,
            },
            {
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
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getInProgressTicketsForBoard`,
            {
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
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateColumnOnTicket`,
            {
                columnId: updatedColumnId,
            },
            {
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
        await Axios.delete(
            `${environmentVariables.baseAuthenticatedApiUrl}/deleteTicket`,
            {
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
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/markTicketAsDone`,
            {},
            {
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
        lastEvaluatedItemId?: string,
        lastEvaluatedBelongsTo?: string
    ): Promise<IGetDoneTicketsResponse> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getDoneTickets`,
            {
                params: {
                    companyId,
                    boardId,
                    limit: 20,
                    lastEvaluatedItemId,
                    lastEvaluatedBelongsTo,
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
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getTicketInformationById`,
            {
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
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/updateTicketForBoard`,
            ticketUpdateRequest,
            {
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
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getBacklogTicketsForBoard`,
            {
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
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/moveNonInProgressTicketToInProgress`,
            {},
            {
                params: {
                    companyId,
                    boardId,
                    ticketId,
                    columnId,
                },
            }
        );
    }

    public async moveNonBacklogTicketToBacklog(
        companyId: string,
        boardId: string,
        ticketId: string
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/moveNonBacklogTicketToBacklog`,
            {},
            {
                params: {
                    companyId,
                    boardId,
                    ticketId,
                },
            }
        );
    }

    public async getTicketFilesWithSignedUrls(
        companyId: string,
        boardId: string,
        ticketId: string
    ): Promise<IFileForTicket[]> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getTicketFilesWithSignedUrls`,
            {
                params: {
                    companyId,
                    boardId,
                    ticketId,
                },
            }
        );

        return axiosResponse.data as IFileForTicket[];
    }

    public async createUploadTicketImageSignedUrls(
        companyId: string,
        boardId: string,
        ticketId: string,
        files: {
            name: string;
        }[]
    ): Promise<ICreateUploadTicketResponse> {
        const axiosResponse = await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/createUploadTicketImageSignedUrls`,
            {
                files,
            },
            {
                params: {
                    companyId,
                    boardId,
                    ticketId,
                },
            }
        );

        const mappedResponseForEnvironment: ICreateUploadTicketResponse = {};
        const databaseResponse = axiosResponse.data as ICreateUploadTicketResponse;
        Object.keys(databaseResponse).forEach((fileName) => {
            const mappingFromDatabase = databaseResponse[fileName];
            mappedResponseForEnvironment[fileName] = {
                fileName,
                getSignedUrl: signedUrlReplace(
                    mappingFromDatabase.getSignedUrl
                ),
                putSignedUrl: signedUrlReplace(
                    mappingFromDatabase.putSignedUrl
                ),
            };
        });

        return mappedResponseForEnvironment;
    }

    public async deleteTicketFile(
        companyId: string,
        boardId: string,
        ticketId: string,
        fileName: string
    ): Promise<void> {
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/deleteTicketFile`,
            {
                fileName,
            },
            {
                params: {
                    companyId,
                    boardId,
                    ticketId,
                },
            }
        );
    }

    public async getDownloadFileSignedUrl(
        companyId: string,
        boardId: string,
        ticketId: string,
        fileName: string
    ): Promise<string> {
        const axiosResponse = await Axios.get(
            `${environmentVariables.baseAuthenticatedApiUrl}/getDownloadFileSignedUrl`,
            {
                params: {
                    companyId,
                    boardId,
                    ticketId,
                    fileName,
                },
            }
        );

        return axiosResponse.data as string;
    }

    public async setAssignedToTicketField(
        companyId: string,
        boardId: string,
        ticketId: string,
        assignedTo:
            | ""
            | {
                  userId: string;
                  name: string;
              }
    ): Promise<void> {
        console.log("assigned to: ", assignedTo);
        await Axios.post(
            `${environmentVariables.baseAuthenticatedApiUrl}/setAssignedToTicketField`,
            {
                ...assignedTo,
            },
            {
                params: {
                    companyId,
                    boardId,
                    ticketId,
                },
            }
        );
    }
}
