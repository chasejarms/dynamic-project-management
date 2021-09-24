import { TextField } from "@mui/material";
import { ChangeEventHandler } from "react";

export interface IWrapperTextFieldProps {
    autoFocus?: boolean;
    label: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    error?: string;
    hint?: string;
    value: unknown;
    type?: string;
    testIds?: {
        input?: string;
        helperTextContainer?: string;
    };
    disabled?: boolean;
    multiline?: boolean;
    placeholder?: string;
    required?: boolean;
}

export function WrappedTextField(props: IWrapperTextFieldProps) {
    const { testIds, error, hint, ...rest } = props;

    const hasError = !!error;
    // this ensures there is always spacing in place for the helper text
    const helperText = error || hint || " ";

    return (
        <TextField
            {...rest}
            minRows={3}
            error={hasError}
            helperText={helperText}
            variant="outlined"
            sx={{
                width: "100%",
                marginTop: 1,
            }}
            inputProps={{
                "data-testid": testIds?.input,
            }}
            InputProps={{
                sx: {
                    bgcolor: "background.paper",
                },
            }}
            FormHelperTextProps={
                {
                    "data-testid": testIds?.helperTextContainer,
                } as any
            }
        />
    );
}
