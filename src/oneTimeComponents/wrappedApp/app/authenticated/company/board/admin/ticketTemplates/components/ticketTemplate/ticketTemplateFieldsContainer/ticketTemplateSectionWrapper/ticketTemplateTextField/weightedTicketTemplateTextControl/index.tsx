import { ChangeEvent } from "react";
import { WrappedTextField } from "../../../../../../../../../../../components/wrappedTextField";
import React from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";

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

    return (
        <Box
            sx={{
                padding: 2,
                bgcolor: "background.default",
                borderRadius: "5px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "divider",
            }}
        >
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
        </Box>
    );
}

export const WeightedTicketTemplateTextControl = React.memo(
    NonMemoizedTicketTemplateTextControl
);
