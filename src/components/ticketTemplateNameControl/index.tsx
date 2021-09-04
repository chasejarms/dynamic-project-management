/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { StringValidator } from "../../classes/StringValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";

export interface ITicketTemplateNameControlProps {
    templateName: string;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
}

export const ticketTemplateNameUniqueId = "ticket-template-name";
function NonMemoizedTicketTemplateNameControl(
    props: ITicketTemplateNameControlProps
) {
    const nameControl = useControl({
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
        nameControl.resetControlState(props.templateName);
    }, [props.refreshToken, props.templateName]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: ticketTemplateNameUniqueId,
            value: nameControl.value,
            error: nameControl.errorMessage,
            isDirty: nameControl.isDirty,
        });
    }, [nameControl.value, nameControl.errorMessage, nameControl.isDirty]);

    const showNameError = !nameControl.isValid && nameControl.isTouched;

    return (
        <WrappedTextField
            value={nameControl.value}
            label="Template Name"
            onChange={nameControl.onChange}
            error={showNameError ? nameControl.errorMessage : ""}
            disabled={props.disabled}
        />
    );
}

export const TicketTemplateNameControl = React.memo(
    NonMemoizedTicketTemplateNameControl
);
