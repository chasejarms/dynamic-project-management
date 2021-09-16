import { ITicket } from "../../models/ticket";
import { ITicketTemplate } from "../../models/ticketTemplate";
import mathEvaluator from "math-expression-evaluator";

export function createTicketPriorityScore(
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
