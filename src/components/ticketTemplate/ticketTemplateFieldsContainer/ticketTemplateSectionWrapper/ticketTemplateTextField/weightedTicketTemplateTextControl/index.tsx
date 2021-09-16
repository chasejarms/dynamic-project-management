/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { WrappedTextField } from "../../../../../../oneTimeComponents/wrappedApp/app/components/wrappedTextField";
import React from "react";
import { Checkbox, FormControlLabel, Theme, useTheme } from "@material-ui/core";

export interface ITicketTemplateTextControlProps {
    label: string;
    multiline: boolean;
    disabled: boolean;
    error: string;
    touched: boolean;
    required: boolean;
    onChangeLabelText: (
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onChangeMultilineValue: (checked: boolean) => void;
    onChangeRequiredValue: (checked: boolean) => void;
}

function NonMemoizedTicketTemplateTextControl(
    props: ITicketTemplateTextControlProps
) {
    const showLabelError = !!props.error && props.touched;

    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.container}>
            <WrappedTextField
                value={props.label}
                required
                label="Text Field Label"
                onChange={props.onChangeLabelText}
                error={showLabelError ? props.error : ""}
                disabled={props.disabled}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={props.disabled}
                        color="primary"
                        checked={props.multiline}
                        onChange={(unused, checked) =>
                            props.onChangeMultilineValue(checked)
                        }
                        name="allowMultilineText"
                    />
                }
                label="Allow Multiline Text"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={props.disabled}
                        color="primary"
                        checked={props.required}
                        onChange={(unused, checked) =>
                            props.onChangeRequiredValue(checked)
                        }
                        name="required"
                    />
                }
                label="Required"
            />
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const container = css`
        padding: 16px;
        background-color: ${theme.palette.grey["200"]};
        border-radius: 3px;
    `;

    return {
        container,
    };
};

export const WeightedTicketTemplateTextControl = React.memo(
    NonMemoizedTicketTemplateTextControl
);
