/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
} from "@material-ui/core";
import { ChangeEvent } from "react";

export interface IWrapperTextFieldProps {
    autoFocus?: boolean;
    label: string;
    onChange: (
        eventType: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    error?: string;
    hint?: string;
    value: unknown;
    type?: string;
    testIds?: {
        helperTextContainer?: string;
        input?: string;
    };
    disabled?: boolean;
    multiline?: boolean;
    placeholder?: string;
    required?: boolean;
}

export function WrappedTextField(props: IWrapperTextFieldProps) {
    const classes = createClasses();

    return (
        <div css={classes.fullWidth}>
            <FormControl fullWidth error={!!props.error}>
                <InputLabel required={props.required}>{props.label}</InputLabel>
                <Input
                    multiline={props.multiline}
                    value={props.value}
                    onChange={props.onChange}
                    type={props.type}
                    inputProps={{
                        "data-testid": props.testIds?.input,
                    }}
                    disabled={props.disabled}
                    placeholder={props.placeholder}
                    required={props.required}
                />
            </FormControl>
            <div
                css={classes.helperTextContainer}
                data-testid={props.testIds?.helperTextContainer}
            >
                <FormHelperText error={!!props.error}>
                    {props.error || props.hint}
                </FormHelperText>
            </div>
        </div>
    );
}

const createClasses = () => {
    const helperTextContainer = css`
        min-height: 19px;
    `;

    const fullWidth = css`
        width: 100%;
    `;

    return {
        helperTextContainer,
        fullWidth,
    };
};