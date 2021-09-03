import { ITicket } from "../../models/ticket";
import { IAugmentedUITicket } from "../../components/ticketForBoard";

export function ticketsToAugmentedUITickets(
    tickets: ITicket[]
): IAugmentedUITicket[] {
    return tickets.map((ticket) => {
        const pointValue = 0;
        const ticketForUI: IAugmentedUITicket = {
            ...ticket,
            pointValueFromTags: pointValue,
        };

        return ticketForUI;
    });
}
