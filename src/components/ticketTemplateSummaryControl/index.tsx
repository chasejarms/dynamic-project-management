/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { ChangeEvent, useEffect } from "react";
import { ControlValidator } from "../../classes/ControlValidator";
import { useControl } from "../../hooks/useControl";
import { IGhostControlParams } from "../../models/ghostControlPattern/ghostControlParams";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketTemplateSummaryControl {
    summary: string;
    disabled: boolean;
    onStateChange: (ghostControlParams: IGhostControlParams) => void;
    refreshToken: {};
    onClickAddAfter: (index: number) => void;
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
            <div css={classes.actionButtonContainer}>
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

const createClasses = () => {
    const container = css`
        position: relative;
        width: 100%;
    `;

    const actionButtonContainer = css`
        position: absolute;
        right: -60px;
        top: 12px;
    `;

    return {
        container,
        actionButtonContainer,
    };
};
