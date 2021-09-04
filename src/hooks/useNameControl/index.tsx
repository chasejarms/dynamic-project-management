import React, { ChangeEvent } from "react";
import { StringValidator } from "../../classes/StringValidator";
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
            return new StringValidator()
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
