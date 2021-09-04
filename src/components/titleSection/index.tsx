/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect } from "react";
import { StringValidator } from "../../classes/StringValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";

export interface ITitleSectionProps {
    title: string;
    label: string;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
}

export const titleSectionUniqueId = "title-section-unique-id";
function NonMemoizedTitleSection(props: ITitleSectionProps) {
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
            return new StringValidator()
                .required("A title is required")
                .validate(title);
        },
    });

    useEffect(() => {
        titleControl.resetControlState(props.title);
    }, [props.title, props.refreshToken]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: titleSectionUniqueId,
            value: titleControl.value,
            error: titleControl.errorMessage,
            isDirty: titleControl.isDirty,
        });
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

export const TitleSection = React.memo(NonMemoizedTitleSection);
