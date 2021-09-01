/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";
import { Checkbox, FormControlLabel, Theme, useTheme } from "@material-ui/core";

export interface IWeightedTicketTemplateNumberControl {
    label: string;
    labelError: string;
    allowOnlyIntegers: boolean;
    minValue?: number;
    maxValue?: number;
    disabled: boolean;
    required: boolean;
    onChangeLabelText: (
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onChangeAllowOnlyIntegers: (checked: boolean) => void;
    onChangeMinValue: (
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onChangeMaxValue: (
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onChangeRequiredValue: (checked: boolean) => void;
}

function NonMemoizedWeightedTicketTemplateNumberControl(
    props: IWeightedTicketTemplateNumberControl
) {
    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.container}>
            <WrappedTextField
                value={props.label}
                required
                label="Text Field Label"
                onChange={props.onChangeLabelText}
                error={props.labelError}
                disabled={props.disabled}
            />
            <WrappedTextField
                value={props.minValue}
                type="number"
                label="Min Value"
                onChange={props.onChangeMinValue}
                error={props.labelError}
                disabled={props.disabled}
            />
            <WrappedTextField
                value={props.minValue}
                type="number"
                label="Max Value"
                onChange={props.onChangeMinValue}
                error={props.labelError}
                disabled={props.disabled}
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
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={props.disabled}
                        color="primary"
                        checked={props.allowOnlyIntegers}
                        onChange={(unused, checked) =>
                            props.onChangeAllowOnlyIntegers(checked)
                        }
                        name="allowMultilineText"
                    />
                }
                label="Allow Only Integers"
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

export const WeightedTicketTemplateNumberControl = React.memo(
    NonMemoizedWeightedTicketTemplateNumberControl
);
