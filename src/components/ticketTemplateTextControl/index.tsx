/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";
import { AddDeleteSectionWrapper } from "../AddDeleteSectionWrapper";

export interface ITicketTemplateTextControlProps {
    label: string;
    index: number;
    uniqueId: string;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
    onClickAddAfter: (index: number) => void;
    onClickDelete: (index: number, uniqueId: string) => void;
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
        <AddDeleteSectionWrapper
            disabled={props.disabled}
            onClickAddAfter={() => {
                props.onClickAddAfter(props.index);
            }}
            onClickDelete={() => {
                props.onClickDelete(props.index, props.uniqueId);
            }}
        >
            <WrappedTextField
                value={textLabelControl.value}
                label="Text Field Label"
                onChange={textLabelControl.onChange}
                error={showNameError ? textLabelControl.errorMessage : ""}
                disabled={props.disabled}
            />
        </AddDeleteSectionWrapper>
    );
}

export const TicketTemplateTextControl = React.memo(
    NonMemoizedTicketTemplateTextControl
);
