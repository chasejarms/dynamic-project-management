import { IDefaultPrimaryTableModel } from "../sharedModels/defaultPrimaryTableModel";

export interface ITicket extends IDefaultPrimaryTableModel {
    shortenedItemId: string;
    title: string;
    summary: string;
    sections: {
        value: string | number;
    }[];
    ticketTemplateShortenedItemId: string;
    createdTimestamp: string;
    lastModifiedTimestamp: string;
    completedTimestamp: string;
    columnId: string;
    directAccessTicketId: string;
    assignedTo?:
        | ""
        | {
              userId: string;
              name: string;
          };
}
