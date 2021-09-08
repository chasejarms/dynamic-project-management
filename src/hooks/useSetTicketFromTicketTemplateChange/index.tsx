import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { IStoreState } from "../../redux/storeState";
import {
    numberSectionError,
    setInitialTicketData,
    textSectionError,
    ticketPreviewId,
    ticketSummaryError,
    ticketTitleError,
} from "../../redux/ticket";

export function useSetTicketFromTicketTemplateChange(
    runEffect: boolean,
    ticketTemplateId: string
) {
    const dispatch = useDispatch();

    const weightedTicketTemplate = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[ticketTemplateId];
    });

    useEffect(() => {
        if (!runEffect) return;

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
                    error: ticketTitleError(""),
                },
                summary: {
                    value: "",
                    touched: false,
                    error: ticketSummaryError(""),
                },
                sections: weightedTicketTemplate.sections.map((section) => {
                    const error =
                        section.value.type === "text"
                            ? textSectionError("", section.value.required)
                            : numberSectionError("", section.value);
                    return {
                        value: "",
                        touched: false,
                        error,
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
