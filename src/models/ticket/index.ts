export interface ITicket {
    itemId: string;
    belongsTo: string;
    shortenedItemId: string;
    title: string;
    summary: string;
    sections: {
        value: string | number;
    }[];
    createdTimestamp: string;
    lastModifiedTimestamp: string;
    completedTimestamp: string;
    columnId: string;
    ticketIdForTicketInformation: string;
    assignedTo?:
        | ""
        | {
              userId: string;
              name: string;
          };
}
