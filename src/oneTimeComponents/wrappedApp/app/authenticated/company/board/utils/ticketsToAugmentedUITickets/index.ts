import { ITicket } from "../../../../../../../../models/ticket";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { IAugmentedUITicket } from "../../../../../../../../models/augmentedUITicket";
import mathEvaluator from "math-expression-evaluator";

export const defaultHiddenPriorityScoreValue = -20000000;

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
            pointValue = defaultHiddenPriorityScoreValue;
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

function createTicketPriorityScore(
    ticketTemplate: ITicketTemplate,
    ticket: ITicket
) {
    if (!ticketTemplate.priorityWeightingCalculation.trim()) {
        return -20000000;
    }

    let priorityWeightingCalculation =
        ticketTemplate.priorityWeightingCalculation;
    ticketTemplate.sections.forEach((section, index) => {
        if (section.type === "number") {
            if (!!section.alias) {
                const sectionValue = ticket.sections[index];
                priorityWeightingCalculation = priorityWeightingCalculation.replaceAll(
                    section.alias,
                    sectionValue.toString()
                );
            }
        }
    });

    const priority = mathEvaluator.eval(priorityWeightingCalculation);
    return Math.round(Number(priority));
}
