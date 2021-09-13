import { ITicket } from "../../models/ticket";
import { IAugmentedUITicket } from "../../components/ticketForBoard";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { createTicketPriorityScore } from "../../components/ticketPriorityScore";

export function ticketsToAugmentedUITickets(
    tickets: ITicket[],
    ticketTemplatesMapping: {
        [ticketTemplateShortenedItemId: string]: ITicketTemplate;
    }
): IAugmentedUITicket[] {
    return tickets.map((ticket) => {
        const ticketTemplate =
            ticketTemplatesMapping[ticket.ticketTemplateShortenedItemId];
        let pointValue = 0;
        if (ticketTemplate.priorityWeightingCalculation.trim() === "") {
            pointValue = -20000000;
        } else {
            pointValue = createTicketPriorityScore(ticketTemplate, ticket);
        }
        const ticketForUI: IAugmentedUITicket = {
            ...ticket,
            pointValueFromTags: pointValue,
        };

        return ticketForUI;
    });
}
