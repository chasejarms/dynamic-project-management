/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";

export interface ISummarySectionProps {
    summary: string;
    label: string;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
}

export const summarySectionUniqueId = "summary-section-unique-id";
export function SummarySection(props: ISummarySectionProps) {
    const summaryControl = useControl({
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
        summaryControl.resetControlState(props.summary);
    }, [props.summary, props.refreshToken]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: summarySectionUniqueId,
            value: summaryControl.value,
            error: summaryControl.errorMessage,
            isDirty: summaryControl.isDirty,
        });
    }, [
        summaryControl.value,
        summaryControl.errorMessage,
        summaryControl.isDirty,
    ]);

    const showSummaryError =
        !summaryControl.isValid && summaryControl.isTouched;

    return (
        <WrappedTextField
            multiline
            value={summaryControl.value}
            label={props.label}
            onChange={summaryControl.onChange}
            error={showSummaryError ? summaryControl.errorMessage : ""}
        />
    );
}
