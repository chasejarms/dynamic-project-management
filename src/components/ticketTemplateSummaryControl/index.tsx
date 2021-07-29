/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateSummaryControl {
    summary: string;
    disabled: boolean;
    onStateChange: (
        uniqueId: string,
        value: string,
        error: string,
        isDirty: boolean
    ) => void;
    onClickAddAfter: (index: number) => void;
    refreshToken: {};
}

export const ticketTemplateSummaryControlId = "ticket-template-summary";
export function TicketTemplateSummaryControl(
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
        props.onStateChange(
            ticketTemplateSummaryControlId,
            summaryControl.value,
            summaryControl.errorMessage,
            summaryControl.isDirty
        );
    }, [
        summaryControl.value,
        summaryControl.errorMessage,
        summaryControl.isDirty,
    ]);

    const showNameError = !summaryControl.isValid && summaryControl.isTouched;
    const classes = createClasses();

    return (
        <div css={classes.container}>
            <WrappedTextField
                value={summaryControl.value}
                label="Ticket Summary Label"
                onChange={summaryControl.onChange}
                error={showNameError ? summaryControl.errorMessage : ""}
                disabled={props.disabled}
            />
            <div css={classes.afterButtonContainer}>
                <IconButton
                    onClick={() => props.onClickAddAfter(-1)}
                    color="primary"
                >
                    <Add />
                </IconButton>
            </div>
        </div>
    );
}

function createClasses() {
    const container = css`
        width: 100%;
        position: relative;
    `;

    const afterButtonContainer = css`
        position: absolute;
        right: -60px;
        top: 10px;
    `;

    return {
        container,
        afterButtonContainer,
    };
}
