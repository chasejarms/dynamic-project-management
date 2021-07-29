/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";

export interface ITicketTemplateTextControlProps {
    label: string;
    uniqueId: string;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
}

function NonMemoizedTicketTemplateTextControl(
    props: ITicketTemplateTextControlProps
) {
    const textLabelControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (textLabel: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(textLabel);
        },
    });

    useEffect(() => {
        textLabelControl.resetControlState(props.label);
    }, [props.refreshToken, props.label]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: props.uniqueId,
            value: textLabelControl.value,
            error: textLabelControl.errorMessage,
            isDirty: textLabelControl.isDirty,
        });
    }, [
        textLabelControl.value,
        textLabelControl.errorMessage,
        textLabelControl.isDirty,
    ]);

    const showNameError =
        !textLabelControl.isValid && textLabelControl.isTouched;

    return (
        <WrappedTextField
            value={textLabelControl.value}
            label="Text Field Label"
            onChange={textLabelControl.onChange}
            error={showNameError ? textLabelControl.errorMessage : ""}
            disabled={props.disabled}
        />
    );
}

export const TicketTemplateTextControl = React.memo(
    NonMemoizedTicketTemplateTextControl
);
