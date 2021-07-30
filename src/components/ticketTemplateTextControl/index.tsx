/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";
import { AddDeleteSectionWrapper } from "../addDeleteSectionWrapper";
import { Checkbox, FormControlLabel, Theme, useTheme } from "@material-ui/core";

export interface ITicketTemplateTextControlProps {
    label: string;
    multiline: boolean;
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

    const multilineTextControl = useControl({
        value: false,
        onChange: (checked: boolean) => {
            return checked;
        },
    });

    useEffect(() => {
        textLabelControl.resetControlState(props.label);
        multilineTextControl.resetControlState(props.multiline);
    }, [props.refreshToken, props.label, props.multiline]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: props.uniqueId,
            value: {
                label: textLabelControl.value,
                multiline: multilineTextControl.value,
                type: "text",
            },
            error:
                textLabelControl.errorMessage ||
                multilineTextControl.errorMessage,
            isDirty: textLabelControl.isDirty || multilineTextControl.isDirty,
        });
    }, [
        textLabelControl.value,
        textLabelControl.errorMessage,
        textLabelControl.isDirty,
        multilineTextControl.value,
        multilineTextControl.errorMessage,
        multilineTextControl.isDirty,
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
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={props.disabled}
                        color="primary"
                        checked={multilineTextControl.value}
                        onChange={(unused, checked) =>
                            multilineTextControl.onChange(checked)
                        }
                        name="allowMultilineText"
                    />
                }
                label="Allow Multiline Text"
            />
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
