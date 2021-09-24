import { useSelector } from "react-redux";
import { IStoreState } from "../../../../../../../../../../redux/storeState";
import {
    ITicketTemplateTextSectionControlState,
    ITicketTemplateNumberSectionControlState,
} from "../../../../../../../../../../redux/ticketTemplates";
import { BottomPageToolbar } from "../../../../../components/bottomPageToolbar";
import { IWrappedButtonProps } from "../../../../../../../components/wrappedButton";

export interface ITicketTemplateBottomToolbarProps {
    onClickActionButton: () => void;
    actionButtonText: string;
    showActionButtonSpinner: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateBottomToolbar(
    props: ITicketTemplateBottomToolbarProps
) {
    const allControlsAreValid = useSelector((store: IStoreState) => {
        const {
            name,
            description,
            title,
            summary,
            sections,
            priorityWeightingCalculation,
        } = store.weightedTicketTemplateCreation[props.ticketTemplateId];

        const nameIsValid = !name.error;
        const descriptionIsValid = !description.error;
        const titleIsValid = !title.error;
        const summaryIsValid = !summary.error;
        const sectionsAreValid = sections.every((section) => {
            if (section.value.type === "text") {
                const textSectionWithControls = section as ITicketTemplateTextSectionControlState;
                return !textSectionWithControls.error;
            } else if (section.value.type === "number") {
                const numberSectionWithControls = section as ITicketTemplateNumberSectionControlState;
                return (
                    !numberSectionWithControls.labelError &&
                    !numberSectionWithControls.minError &&
                    !numberSectionWithControls.maxError
                );
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

    const wrappedButtonProps: IWrappedButtonProps[] = [
        {
            variant: "contained",
            onClick: () => {
                props.onClickActionButton();
            },
            color: "primary",
            disabled: props.showActionButtonSpinner || !allControlsAreValid,
            showSpinner: props.showActionButtonSpinner,
            children: props.actionButtonText,
        },
    ];

    return <BottomPageToolbar wrappedButtonProps={wrappedButtonProps} />;
}
