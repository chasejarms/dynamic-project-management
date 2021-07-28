/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateTitleControlProps {
    title: string;
    disabled: boolean;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean
    ) => void;
    refreshToken: {};
}

export const ticketTemplateTitleControlId = "ticket-template-title";
export function TicketTemplateTitleControl(
    props: ITicketTemplateTitleControlProps
) {
    const titleControl = useControl({
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
        titleControl.resetControlState(props.title);
    }, [props.title, props.refreshToken]);

    useEffect(() => {
        props.onStateChange(
            ticketTemplateTitleControlId,
            titleControl.value,
            titleControl.errorMessage,
            titleControl.isDirty
        );
    }, [titleControl.value, titleControl.errorMessage, titleControl.isDirty]);

    const showNameError = !titleControl.isValid && titleControl.isTouched;

    return (
        <WrappedTextField
            value={titleControl.value}
            label="Ticket Title Label"
            onChange={titleControl.onChange}
            error={showNameError ? titleControl.errorMessage : ""}
            disabled={props.disabled}
        />
    );
}
