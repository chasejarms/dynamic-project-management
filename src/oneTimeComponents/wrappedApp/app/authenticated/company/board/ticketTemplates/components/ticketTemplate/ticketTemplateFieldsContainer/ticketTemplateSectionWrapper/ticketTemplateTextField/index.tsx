import { Box } from "@mui/material";
import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { INumberSection } from "../../../../../../../../../../../../models/ticketTemplate/section/numberSection";
import { ITextSection } from "../../../../../../../../../../../../models/ticketTemplate/section/textSection";
import {
    deleteWeightedTicketTemplateCreationSection,
    insertWeightedTicketCreationSection,
    overrideWeightedTicketCreationSection,
    ITicketTemplateTextSectionControlState,
} from "../../../../../../../../../../../../redux/ticketTemplates";
import { WeightedPriorityTicketTemplateActions } from "../../weightedPriorityTicketTemplateActions";
import { WeightedTicketTemplateTextControl } from "./weightedTicketTemplateTextControl";

export interface ITicketTemplateTextFieldProps {
    section: ITicketTemplateTextSectionControlState;
    index: number;
    disabled: boolean;
    ticketTemplateId: string;
}

export function TicketTemplateTextField(props: ITicketTemplateTextFieldProps) {
    const { section, index, disabled } = props;

    const dispatch = useDispatch();
    function onChangeLabelText(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const updatedWeightedTextSection: ITextSection = {
                ...section.value,
                label: value,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedTextSection,
                index,
                ticketTemplateId: props.ticketTemplateId,
            });
            dispatch(action);
        };
    }

    function onChangeMultilineValue(index: number) {
        return (checked: boolean) => {
            const updatedWeightedTextSection: ITextSection = {
                ...section.value,
                multiline: checked,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedTextSection,
                index,
                ticketTemplateId: props.ticketTemplateId,
            });
            dispatch(action);
        };
    }

    function onChangeRequiredValue(index: number) {
        return (checked: boolean) => {
            const updatedWeightedTextSection: ITextSection = {
                ...section.value,
                required: checked,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedTextSection,
                index,
                ticketTemplateId: props.ticketTemplateId,
            });
            dispatch(action);
        };
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

    function onClickDelete(index: number) {
        return () => {
            const action = deleteWeightedTicketTemplateCreationSection({
                index,
                ticketTemplateId: props.ticketTemplateId,
            });
            dispatch(action);
        };
    }

    return (
        <>
            <div>
                <WeightedTicketTemplateTextControl
                    label={section.value.label}
                    multiline={section.value.multiline}
                    disabled={disabled}
                    error={section.error}
                    touched={true}
                    required={section.value.required}
                    onChangeLabelText={onChangeLabelText(index)}
                    onChangeMultilineValue={onChangeMultilineValue(index)}
                    onChangeRequiredValue={onChangeRequiredValue(index)}
                />
            </div>
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <WeightedPriorityTicketTemplateActions
                    disabled={props.disabled}
                    onClickAddAfter={onClickAddAfter(index)}
                    onClickDelete={onClickDelete(index)}
                />
            </Box>
        </>
    );
}
