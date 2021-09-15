import {
    backlogColumnReservedId,
    uncategorizedColumnReservedId,
} from "../../constants/reservedColumnIds";
import { IAugmentedUITicket } from "../../models/augmentedUITicket";
import { IColumn } from "../../models/column";
import { ITicket } from "../../models/ticket";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { sortTickets } from "../sortTickets";
import { ticketsToAugmentedUITickets } from "../ticketsToAugmentedUITickets";

export function createColumnsMapping(
    columns: IColumn[],
    tickets: ITicket[],
    ticketTemplatesMapping: {
        [ticketTemplateShortenedItemId: string]: ITicketTemplate;
    },
    pushAllTicketsToBacklog?: boolean
) {
    const columnsMapping: {
        [columnId: string]: {
            columnInformation: IColumn;
            tickets: IAugmentedUITicket[];
        };
    } = {
        [backlogColumnReservedId]: {
            columnInformation: {
                name: "Backlog",
                id: backlogColumnReservedId,
                canBeModified: false,
            },
            tickets: [],
        },
    };

    columns.forEach((column) => {
        columnsMapping[column.id] = {
            columnInformation: column,
            tickets: [],
        };
    }, {});

    const augmentedUITickets = ticketsToAugmentedUITickets(
        tickets,
        ticketTemplatesMapping
    );
    augmentedUITickets.forEach((ticketForUI) => {
        if (!!pushAllTicketsToBacklog) {
            columnsMapping[backlogColumnReservedId].tickets.push(ticketForUI);
            return;
        }

        const columnId = ticketForUI.columnId;
        const columnExists = !!columnsMapping[columnId];
        if (columnExists) {
            columnsMapping[columnId].tickets.push(ticketForUI);
        } else {
            columnsMapping[uncategorizedColumnReservedId].tickets.push(
                ticketForUI
            );
        }
    });

    Object.keys(columnsMapping).forEach((columnId) => {
        columnsMapping[columnId].tickets = sortTickets(
            columnsMapping[columnId].tickets
        );
    });

    return columnsMapping;
}
