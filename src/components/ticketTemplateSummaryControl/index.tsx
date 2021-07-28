/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateSummaryControl {
    summary: string;
    disabled: boolean;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean
    ) => void;
}

export const ticketTemplateSummaryControlId = "ticket-template-summary";
export function TicketTemplateSummaryControl(
    props: ITicketTemplateSummaryControl
) {
    const summaryControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (templateName: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(templateName);
        },
    });

    useEffect(() => {
        summaryControl.resetControlState(props.summary);
    }, [props.summary]);

    useEffect(() => {
        props.onStateChange(
            ticketTemplateSummaryControlId,
            summaryControl.value,
            summaryControl.errorMessage,
            summaryControl.isDirty
        );
    }, [
        summaryControl.value,
        summaryControl.errorMessage,
        summaryControl.isDirty,
    ]);

    const showNameError = !summaryControl.isValid && summaryControl.isTouched;

    return (
        <WrappedTextField
            value={summaryControl.value}
            label="Template Name"
            onChange={summaryControl.onChange}
            error={showNameError ? summaryControl.errorMessage : ""}
            disabled={props.disabled}
        />
    );
}
