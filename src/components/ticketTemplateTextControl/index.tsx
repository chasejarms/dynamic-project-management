/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";
import { AddDeleteSectionWrapper } from "../AddDeleteSectionWrapper";
import { Theme, useTheme } from "@material-ui/core";

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

    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.container}>
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
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        padding: 16px;
        background-color: ${theme.palette.grey["200"]};
        border-radius: 3px;
        margin-top: 16px;
        margin-bottom: 16px;
    `;

    return {
        container,
    };
};

export const TicketTemplateTextControl = React.memo(
    NonMemoizedTicketTemplateTextControl
);
