/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useSelector } from "react-redux";
import { IStoreState } from "../../../redux/storeState";
import {
    WeightedTextSectionWithControls,
    WeightedNumberSectionWithControls,
} from "../../../redux/weightedTicketTemplateCreation";
import { BottomPageToolbar } from "../../bottomPageToolbar";
import { IWrappedButtonProps } from "../../wrappedButton";

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
                const textSectionWithControls = section as WeightedTextSectionWithControls;
                return !textSectionWithControls.error;
            } else if (section.value.type === "number") {
                const numberSectionWithControls = section as WeightedNumberSectionWithControls;
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
