import { jsx, css } from "@emotion/core";
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
    value: string;
    type?: string;
    testIds?: {
        helperTextContainer?: string;
        input?: string;
    };
    disabled?: boolean;
}

export function WrappedTextField(props: IWrapperTextFieldProps) {
    const classes = createClasses();

    return (
        <div>
            <FormControl fullWidth error={!!props.error}>
                <InputLabel>{props.label}</InputLabel>
                <Input
                    value={props.value}
                    onChange={props.onChange}
                    type={props.type}
                    inputProps={{
                        "data-testid": props.testIds?.input,
                    }}
                    disabled={props.disabled}
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

    return {
        helperTextContainer,
    };
};
