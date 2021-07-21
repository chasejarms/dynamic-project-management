import { ITicket } from "./ticket";

export interface IGetDoneTicketsResponse {
    items: ITicket[];
    lastEvaluatedKey?: string;
}
