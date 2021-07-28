import { ITicketTemplatePutRequest } from "./ticketTemplatePutRequest";

export interface ITicketTemplate extends ITicketTemplatePutRequest {
    itemId: string;
    belongsTo: string;
    shortenedItemId: string;
}
