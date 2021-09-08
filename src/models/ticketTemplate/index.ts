import { ITicketTemplateCreateRequest } from "./ticketTemplateCreateRequest";

export interface ITicketTemplate extends ITicketTemplateCreateRequest {
    itemId: string;
    belongsTo: string;
    shortenedItemId: string;
}
