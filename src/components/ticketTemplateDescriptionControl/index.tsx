/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateDescriptionControl {
    templateDescription: string;
    disabled: boolean;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean
    ) => void;
}

export const ticketTemplateDescriptionUniqueId = "ticket-template-description";
export function TicketTemplateDescriptionControl(
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
            return ControlValidator.string()
                .required("This field is required")
                .validate(description);
        },
    });

    useEffect(() => {
        descriptionControl.resetControlState(props.templateDescription);
    }, [props.templateDescription]);

    useEffect(() => {
        props.onStateChange(
            ticketTemplateDescriptionUniqueId,
            descriptionControl.value,
            descriptionControl.errorMessage,
            descriptionControl.isDirty
        );
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
