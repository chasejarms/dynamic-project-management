/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useControl } from "../../hooks/useControl";
import { generateUniqueId } from "../../utils/generateUniqueId";
import { WrappedTextField } from "../wrappedTextField";

export interface ISummarySectionProps {
    summary: string;
    label: string;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean,
        type?: "title" | "summary"
    ) => void;
}

export function SummarySection(props: ISummarySectionProps) {
    const [uniqueId] = useState(generateUniqueId(3));

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
    }, [props.summary]);

    useEffect(() => {
        props.onStateChange(
            uniqueId,
            summaryControl.value,
            summaryControl.errorMessage,
            summaryControl.isDirty,
            "summary"
        );
    }, [
        summaryControl.value,
        summaryControl.errorMessage,
        summaryControl.isDirty,
    ]);

    const showSummaryError =
        !summaryControl.isValid && summaryControl.isTouched;

    return (
        <WrappedTextField
            value={summaryControl.value}
            label={props.label}
            onChange={summaryControl.onChange}
            error={showSummaryError ? summaryControl.errorMessage : ""}
        />
    );
}
