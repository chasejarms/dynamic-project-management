import { sortBy } from "lodash";
import { IAugmentedUITicket } from "../../components/ticketForBoard";

export function sortTickets(tickets: IAugmentedUITicket[]) {
    return sortBy(
        tickets,
        "pointValueFromTags",
        (ticket: IAugmentedUITicket) => {
            return -Number(ticket.createdTimestamp);
        }
    ).reverse();
}
