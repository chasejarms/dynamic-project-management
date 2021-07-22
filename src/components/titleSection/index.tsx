/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { generateUniqueId } from "../../utils/generateUniqueId";
import { WrappedTextField } from "../wrappedTextField";

export interface ITitleSectionProps {
    title: string;
    label: string;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean,
        type?: "title" | "summary"
    ) => void;
}

export function TitleSection(props: ITitleSectionProps) {
    const [uniqueId] = useState(generateUniqueId(3));

    const titleControl = useControl({
        value: "",
        onChange: (
            event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
            }>
        ) => {
            return event.target.value as string;
        },
        validatorError: (title: string) => {
            return ControlValidator.string()
                .required("A title is required")
                .validate(title);
        },
    });

    useEffect(() => {
        titleControl.resetControlState(props.title);
    }, [props.title]);

    useEffect(() => {
        props.onStateChange(
            uniqueId,
            titleControl.value,
            titleControl.errorMessage,
            titleControl.isDirty,
            "title"
        );
    }, [titleControl.value, titleControl.errorMessage, titleControl.isDirty]);

    const showTitleError = !titleControl.isValid && titleControl.isTouched;

    return (
        <WrappedTextField
            value={titleControl.value}
            label={props.label}
            onChange={titleControl.onChange}
            error={showTitleError ? titleControl.errorMessage : ""}
        />
    );
}
