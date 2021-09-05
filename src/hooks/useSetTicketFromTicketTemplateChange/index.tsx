import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { IStoreState } from "../../redux/storeState";
import { setInitialTicketData, ticketPreviewId } from "../../redux/ticket";

export function useSetTicketFromTicketTemplateChange() {
    const dispatch = useDispatch();

    const weightedTicketTemplate = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation;
    });

    useEffect(() => {
        const ticketTemplate: ITicketTemplate = {
            itemId: "",
            belongsTo: "",
            shortenedItemId: "",
            name: weightedTicketTemplate.name.value,
            description: weightedTicketTemplate.description.value,
            title: {
                label: weightedTicketTemplate.title.value,
            },
            summary: {
                label: weightedTicketTemplate.summary.value,
            },
            sections: weightedTicketTemplate.sections.map((section) => {
                return section.value;
            }),
            priorityWeightingCalculation: "",
        };

        const action = setInitialTicketData({
            ticketTemplate,
            ticketId: ticketPreviewId,
            ticket: {
                title: {
                    value: "",
                    touched: false,
                    error: "",
                },
                summary: {
                    value: "",
                    touched: false,
                    error: "",
                },
                sections: weightedTicketTemplate.sections.map((section) => {
                    return {
                        value: "",
                        touched: false,
                        error: "",
                    };
                }),
            },
            priorityWeightingFunction: {
                value: "",
                error: "",
            },
        });
        dispatch(action);
    }, [weightedTicketTemplate]);
}
