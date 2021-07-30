/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect } from "react";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";

export interface ITextSectionProps {
    uniqueId: string;
    value: string;
    label: string;
    multiline: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
}

function NonMemoizedTextSection(props: ITextSectionProps) {
    const textControl = useControl({
        value: "",
        onChange: (
            event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
            }>
        ) => {
            return event.target.value as string;
        },
    });

    useEffect(() => {
        textControl.resetControlState(props.value);
    }, [props.value, props.refreshToken]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: props.uniqueId,
            value: textControl.value,
            error: textControl.errorMessage,
            isDirty: textControl.isDirty,
        });
    }, [textControl.value, textControl.errorMessage, textControl.isDirty]);

    const showSummaryError = !textControl.isValid && textControl.isTouched;

    return (
        <WrappedTextField
            multiline={props.multiline}
            value={textControl.value}
            label={props.label}
            onChange={textControl.onChange}
            error={showSummaryError ? textControl.errorMessage : ""}
        />
    );
}

export const TextSection = React.memo(NonMemoizedTextSection);
