import React, { ChangeEvent } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../useControl";

export function useNameControl() {
    const nameControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (name: string) => {
            return ControlValidator.string()
                .required("A name is required")
                .validate(name);
        },
    });
    const showNameError = !nameControl.isValid && nameControl.isTouched;

    return {
        nameControl,
        showNameError,
    };
}
