import { Section } from "../ticketTemplate/section";

export interface ITicket {
    itemId: string;
    belongsTo: string;
    shortenedItemId: string;
    title: string;
    summary: string;
    sections: any[];
    createdTimestamp: string;
    lastModifiedTimestamp: string;
    completedTimestamp: string;
    tags: {
        name: string;
        color: string;
    }[];
    simplifiedTicketTemplate: {
        title: {
            label: string;
        };
        summary: {
            isRequired: boolean;
            label: string;
        };
        sections: Section[];
    };
    columnId: string;
    ticketIdForTicketInformation: string;
    assignedTo?:
        | ""
        | {
              userId: string;
              name: string;
          };
}
