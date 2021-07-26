import { ITicket } from "./ticket";

export interface IGetDoneTicketsResponse {
    items: ITicket[];
    lastEvaluatedKey?: {
        itemId: string;
        belongsTo: string;
    };
}
