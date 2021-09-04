/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { StringValidator } from "../../classes/StringValidator";
import { useControl } from "../../hooks/useControl";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";

export interface ITicketTemplateTitleControlProps {
    title: string;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
}

export const ticketTemplateTitleControlId = "ticket-template-title";
function NonMemoizedTicketTemplateTitleControl(
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
            return new StringValidator()
                .required("This field is required")
                .validate(templateName);
        },
    });

    useEffect(() => {
        titleControl.resetControlState(props.title);
    }, [props.title, props.refreshToken]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: ticketTemplateTitleControlId,
            value: titleControl.value,
            error: titleControl.errorMessage,
            isDirty: titleControl.isDirty,
        });
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

export const TicketTemplateTitleControl = React.memo(
    NonMemoizedTicketTemplateTitleControl
);
