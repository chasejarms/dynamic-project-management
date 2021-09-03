import { IAugmentedUITicket } from "../../components/ticketForBoard";
import { uncategorizedColumnReservedId } from "../../constants/reservedColumnIds";
import { IColumn } from "../../models/column";
import { ITicket } from "../../models/ticket";
import { sortTickets } from "../sortTickets";
import { ticketsToAugmentedUITickets } from "../ticketsToAugmentedUITickets";

export function createColumnsMapping(columns: IColumn[], tickets: ITicket[]) {
    const columnsMapping = columns.reduce<{
        [columnId: string]: {
            columnInformation: IColumn;
            tickets: IAugmentedUITicket[];
        };
    }>((mapping, column) => {
        mapping[column.id] = {
            columnInformation: column,
            tickets: [],
        };
        return mapping;
    }, {});

    const augmentedUITickets = ticketsToAugmentedUITickets(tickets);
    augmentedUITickets.forEach((ticketForUI) => {
        const columnId = ticketForUI.columnId;
        if (columnId && !!columnsMapping[columnId]) {
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
