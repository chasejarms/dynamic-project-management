import React, { ChangeEvent } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../useControl";

export function useEmailControl() {
    const emailControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (email: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .email("A valid email is required")
                .validate(email);
        },
    });
    const showEmailError = !emailControl.isValid && emailControl.isTouched;

    return {
        emailControl,
        showEmailError,
    };
}
