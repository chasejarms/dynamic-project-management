/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";
import React from "react";
import { AddDeleteSectionWrapper } from "../AddDeleteSectionWrapper";

export interface ITicketTemplateSummaryControl {
    summary: string;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
    onClickAddAfter: (index: number) => void;
}

export const ticketTemplateSummaryControlId = "ticket-template-summary";
function NonMemoizedTicketTemplateSummaryControl(
    props: ITicketTemplateSummaryControl
) {
    const summaryControl = useControl({
        value: "",
        onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            return event.target.value;
        },
        validatorError: (templateName: string) => {
            return ControlValidator.string()
                .required("This field is required")
                .validate(templateName);
        },
    });

    useEffect(() => {
        summaryControl.resetControlState(props.summary);
    }, [props.summary, props.refreshToken]);

    useEffect(() => {
        props.onStateChange({
            uniqueId: ticketTemplateSummaryControlId,
            value: summaryControl.value,
            error: summaryControl.errorMessage,
            isDirty: summaryControl.isDirty,
        });
    }, [
        summaryControl.value,
        summaryControl.errorMessage,
        summaryControl.isDirty,
    ]);

    const showNameError = !summaryControl.isValid && summaryControl.isTouched;
    return (
        <AddDeleteSectionWrapper
            disabled={props.disabled}
            onClickAddAfter={() => props.onClickAddAfter(-1)}
            customCalcLeftPixels={14}
        >
            <WrappedTextField
                value={summaryControl.value}
                label="Ticket Summary Label"
                onChange={summaryControl.onChange}
                error={showNameError ? summaryControl.errorMessage : ""}
                disabled={props.disabled}
            />
        </AddDeleteSectionWrapper>
    );
}

export const TicketTemplateSummaryControl = React.memo(
    NonMemoizedTicketTemplateSummaryControl
);
