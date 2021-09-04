/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { StringValidator } from "../../classes/StringValidator";
import { useControl } from "../../hooks/useControl";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";

export interface ITicketTemplateDescriptionControl {
    templateDescription: string;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
}

export const ticketTemplateDescriptionUniqueId = "ticket-template-description";
function NonMemoizedTicketTemplateDescriptionControl(
    props: ITicketTemplateDescriptionControl
) {
    const descriptionControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (description: string) => {
            return new StringValidator()
                .required("This field is required")
                .validate(description);
        },
    });

    useEffect(() => {
        descriptionControl.resetControlState(props.templateDescription);
    }, [props.templateDescription, props.refreshToken]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: ticketTemplateDescriptionUniqueId,
            value: descriptionControl.value,
            error: descriptionControl.errorMessage,
            isDirty: descriptionControl.isDirty,
        });
    }, [
        descriptionControl.value,
        descriptionControl.errorMessage,
        descriptionControl.isDirty,
    ]);

    const showDescriptionError =
        !descriptionControl.isValid && descriptionControl.isTouched;

    return (
        <WrappedTextField
            value={descriptionControl.value}
            label="Template Description"
            onChange={descriptionControl.onChange}
            error={showDescriptionError ? descriptionControl.errorMessage : ""}
            disabled={props.disabled}
        />
    );
}

export const TicketTemplateDescriptionControl = React.memo(
    NonMemoizedTicketTemplateDescriptionControl
);
