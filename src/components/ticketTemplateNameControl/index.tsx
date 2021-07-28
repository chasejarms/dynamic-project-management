/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateNameControlProps {
    templateName: string;
    disabled: boolean;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean
    ) => void;
}

export const ticketTemplateNameUniqueId = "ticket-template-name";
export function TicketTemplateNameControl(
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
            return ControlValidator.string()
                .required("This field is required")
                .validate(templateName);
        },
    });

    useEffect(() => {
        nameControl.resetControlState(props.templateName);
    }, [props.templateName]);

    useEffect(() => {
        props.onStateChange(
            ticketTemplateNameUniqueId,
            nameControl.value,
            nameControl.errorMessage,
            nameControl.isDirty
        );
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
