/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INumberSection } from "../../../../models/ticketTemplate/section/numberSection";
import { ITextSection } from "../../../../models/ticketTemplate/section/textSection";
import { IStoreState } from "../../../../redux/storeState";
import {
    insertWeightedTicketCreationSection,
    updateWeightedTicketTemplateCreationSummary,
} from "../../../../redux/weightedTicketTemplateCreation";
import { WeightedPriorityTicketTemplateActions } from "../weightedPriorityTicketTemplateActions";
import { WrappedTextField } from "../../../wrappedTextField";

export interface ITicketTemplateSummaryFieldProps {
    disabled: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateSummaryField(
    props: ITicketTemplateSummaryFieldProps
) {
    const value = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .summary.value;
    });

    const touched = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .summary.touched;
    });

    const error = useSelector((store: IStoreState) => {
        return store.weightedTicketTemplateCreation[props.ticketTemplateId]
            .summary.error;
    });

    const dispatch = useDispatch();
    function onChangeTicketTemplateSummary(
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const value = eventType.target.value as string;
        const action = updateWeightedTicketTemplateCreationSummary({
            summary: value,
            ticketTemplateId: props.ticketTemplateId,
        });
        dispatch(action);
    }

    function onClickAddAfter(index: number) {
        return (type: string) => {
            if (type === "text") {
                const weightedTextSection: ITextSection = {
                    type: "text",
                    label: "Default Label",
                    multiline: true,
                    required: false,
                };
                const action = insertWeightedTicketCreationSection({
                    value: weightedTextSection,
                    index,
                    ticketTemplateId: props.ticketTemplateId,
                });
                dispatch(action);
            } else if (type === "number") {
                const weightedNumberSection: INumberSection = {
                    type: "number",
                    label: "Default Label",
                    required: false,
                    allowOnlyIntegers: false,
                    alias: "",
                };
                const action = insertWeightedTicketCreationSection({
                    value: weightedNumberSection,
                    index,
                    ticketTemplateId: props.ticketTemplateId,
                });
                dispatch(action);
            }
        };
    }

    return (
        <>
            <div>
                <WrappedTextField
                    value={value}
                    label="Template Summary"
                    required
                    onChange={onChangeTicketTemplateSummary}
                    error={(touched && error) || ""}
                    disabled={props.disabled}
                />
            </div>
            <div>
                <WeightedPriorityTicketTemplateActions
                    disabled={props.disabled}
                    onClickAddAfter={onClickAddAfter(-1)}
                />
            </div>
        </>
    );
}
