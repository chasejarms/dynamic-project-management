import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../../../../../redux/storeState";
import {
    ITicketTemplateTextSectionControlState,
    ITicketTemplateNumberSectionControlState,
} from "../../../../../../../../../../../../../../redux/ticketTemplates";

export function useTicketTemplateControlsAreValid(ticketTemplateId: string) {
    const allControlsAreValid = useSelector((store: IStoreState) => {
        const {
            name,
            description,
            title,
            summary,
            sections,
            priorityWeightingCalculation,
        } = store.weightedTicketTemplateCreation[ticketTemplateId];

        const nameIsValid = !name.error;
        const descriptionIsValid = !description.error;
        const titleIsValid = !title.error;
        const summaryIsValid = !summary.error;
        const sectionsAreValid = sections.every((section) => {
            if (section.value.type === "text") {
                const textSectionWithControls = section as ITicketTemplateTextSectionControlState;
                return !textSectionWithControls.error;
            } else if (section.value.type === "number") {
                const {
                    labelError,
                    minError,
                    maxError,
                    aliasError,
                } = section as ITicketTemplateNumberSectionControlState;
                return !labelError && !minError && !maxError && !aliasError;
            }
        });
        const priorityWeightingCalculationIsValid = !priorityWeightingCalculation.error;

        return (
            nameIsValid &&
            descriptionIsValid &&
            titleIsValid &&
            summaryIsValid &&
            sectionsAreValid &&
            priorityWeightingCalculationIsValid
        );
    });

    return allControlsAreValid;
}
