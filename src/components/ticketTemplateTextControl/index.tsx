/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { ITextSection } from "../../models/ticketTemplate/textSection";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateTextControl {
    value: ITextSection;
    disabled: boolean;
    index: number;
    onStateChange: (
        uniqueId: string,
        value: ITextSection,
        error: string,
        isDirty: boolean
    ) => void;
    refreshToken: {};
}

export const ticketTemplateNameUniqueId = "ticket-template-name";
export function TicketTemplateTextControl(props: ITicketTemplateTextControl) {
    const ticketTemplateTextControl = useControl<ITextSection, ITextSection>({
        value: {
            label: "",
            multiline: false,
            type: "text",
        },
        onChange: (ticketTemplateValue: ITextSection) => {
            return ticketTemplateValue;
        },
        validatorError: (ticketTemplateValue: ITextSection) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(ticketTemplateValue.label);
        },
    });

    useEffect(() => {
        ticketTemplateTextControl.resetControlState(props.value);
    }, [props.refreshToken, props.value]);

    useEffect(() => {
        props.onStateChange(
            ticketTemplateNameUniqueId,
            ticketTemplateTextControl.value,
            ticketTemplateTextControl.errorMessage,
            ticketTemplateTextControl.isDirty
        );
    }, [
        ticketTemplateTextControl.value,
        ticketTemplateTextControl.errorMessage,
        ticketTemplateTextControl.isDirty,
    ]);

    const showNameError =
        !ticketTemplateTextControl.isValid &&
        ticketTemplateTextControl.isTouched;

    function onChangeTextLabel(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        ticketTemplateTextControl.onChange({
            label: event.target.value as string,
            multiline: ticketTemplateTextControl.value.multiline,
            type: "text",
        });
    }

    const classes = createClasses();

    return (
        <div css={classes.container}>
            <WrappedTextField
                value={ticketTemplateTextControl.value.label}
                label="Template Name"
                onChange={onChangeTextLabel}
                error={
                    showNameError ? ticketTemplateTextControl.errorMessage : ""
                }
                disabled={props.disabled}
            />
        </div>
    );
}

const createClasses = () => {
    const container = css`
        width: 100%;
    `;

    return {
        container,
    };
};
