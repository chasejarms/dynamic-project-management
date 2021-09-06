/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { INumberSection } from "../../models/ticketTemplate/section/numberSection";
import { ITextSection } from "../../models/ticketTemplate/section/textSection";
import {
    deleteWeightedTicketTemplateCreationSection,
    insertWeightedTicketCreationSection,
    overrideWeightedTicketCreationSection,
    WeightedNumberSectionWithControls,
} from "../../redux/weightedTicketTemplateCreation";
import { WeightedPriorityTicketTemplateActions } from "../weightedPriorityTicketTemplateActions";
import { WeightedTicketTemplateNumberControl } from "../weightedTicketTemplateNumberControl";

export interface ITicketTemplateNumberFieldProps {
    disabled: boolean;
    section: WeightedNumberSectionWithControls;
    index: number;
}

export function TicketTemplateNumberField(
    props: ITicketTemplateNumberFieldProps
) {
    const { section, disabled, index } = props;

    const dispatch = useDispatch();
    function onChangeAlias(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const updatedWeightedNumberSection: INumberSection = {
                ...section.value,
                alias: value,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeNumberLabelText(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const updatedWeightedNumberSection: INumberSection = {
                ...section.value,
                label: value,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeMinValue(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const minValue = value !== "" ? Number(value) : undefined;
            const updatedWeightedNumberSection: INumberSection = {
                ...section.value,
                minValue,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeMaxValue(index: number) {
        return (
            eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const value = eventType.target.value as string;
            const maxValue = value !== "" ? Number(value) : undefined;
            const updatedWeightedNumberSection: INumberSection = {
                ...section.value,
                maxValue,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeAllowOnlyIntegers(index: number) {
        return (checked: boolean) => {
            const updatedWeightedNumberSection: INumberSection = {
                ...section.value,
                allowOnlyIntegers: checked,
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
            });
            dispatch(action);
        };
    }

    function onChangeNumberRequiredValue(index: number) {
        return (checked: boolean) => {
            const updatedWeightedNumberSection: INumberSection = {
                ...section.value,
                required: checked,
                alias: "",
            };
            const action = overrideWeightedTicketCreationSection({
                value: updatedWeightedNumberSection,
                index,
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
                });
                dispatch(action);
            }
        };
    }

    function onClickDelete(index: number) {
        return () => {
            const action = deleteWeightedTicketTemplateCreationSection(index);
            dispatch(action);
        };
    }

    const classes = createClasses();
    return (
        <>
            <div>
                <WeightedTicketTemplateNumberControl
                    alias={section.value.alias}
                    aliasError={section.aliasError}
                    onChangeAlias={onChangeAlias(index)}
                    label={section.value.label}
                    labelError={section.labelError}
                    allowOnlyIntegers={section.value.allowOnlyIntegers}
                    disabled={disabled}
                    required={section.value.required}
                    onChangeLabelText={onChangeNumberLabelText(index)}
                    onChangeMinValue={onChangeMinValue(index)}
                    onChangeMaxValue={onChangeMaxValue(index)}
                    onChangeAllowOnlyIntegers={onChangeAllowOnlyIntegers(index)}
                    onChangeRequiredValue={onChangeNumberRequiredValue(index)}
                    minValue={section.value.minValue}
                    minError={section.minError}
                    maxValue={section.value.maxValue}
                    maxError={section.maxError}
                />
            </div>
            <div css={classes.actionButtonContainerForNumberField}>
                <WeightedPriorityTicketTemplateActions
                    disabled={props.disabled}
                    onClickAddAfter={onClickAddAfter(index)}
                    onClickDelete={onClickDelete(index)}
                />
            </div>
        </>
    );
}

const createClasses = () => {
    const actionButtonContainerForNumberField = css`
        height: 100%;
        display: flex;
        align-items: center;
    `;

    return {
        actionButtonContainerForNumberField,
    };
};
