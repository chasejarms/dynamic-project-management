import { ITicket } from "../../models/ticket";
import { IAugmentedUITicket } from "../../components/ticketForBoard";

export function ticketsToAugmentedUITickets(
    tickets: ITicket[],
    priorityToPointValueMapping: {
        [priorityName: string]: number;
    }
): IAugmentedUITicket[] {
    return tickets.map((ticket) => {
        const pointValue = tagsPointValue(
            priorityToPointValueMapping,
            ticket.tags
        );
        const ticketForUI: IAugmentedUITicket = {
            ...ticket,
            pointValueFromTags: pointValue,
        };

        return ticketForUI;
    });
}

function tagsPointValue(
    tagsMapping: {
        [priority: string]: number;
    },
    tags: {
        color: string;
        name: string;
    }[]
) {
    return tags.reduce<number>((pointValue, tag) => {
        const pointValueForTag = tagsMapping[tag.name] || 0;
        return pointValue + pointValueForTag;
    }, 0);
}
