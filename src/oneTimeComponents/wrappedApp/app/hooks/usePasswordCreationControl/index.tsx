import { ChangeEvent } from "react";
import { StringValidator } from "../../../../../classes/StringValidator";
import { useControl } from "../../../../../hooks/useControl";

export function usePasswordCreationControl() {
    const passwordCreationControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (password: string) => {
            return new StringValidator()
                .required("A password is required")
                .min(8, "Password length must be at least 8 characters")
                .customValidator((value: string) => {
                    return value.toUpperCase() !== value;
                }, "Password must have one lowercase character")
                .customValidator((value: string) => {
                    return value.toLowerCase() !== value;
                }, "Password must have one uppercase character")
                .customValidator((value: string) => {
                    return !!value.match(/\d/);
                }, "Password must have at least one number")
                .validate(password);
        },
    });
    const showPasswordCreationError =
        !passwordCreationControl.isValid && passwordCreationControl.isTouched;

    return {
        passwordCreationControl,
        showPasswordCreationError,
    };
}
