/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { ITicket } from "../../redux/ticket";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketProps {
    ticket?: ITicket;
    ticketId: string;
    ticketTemplate: ITicketTemplate;
}

export function Ticket(props: ITicketProps) {
    if (!props.ticket) {
        return <div />;
    }

    const classes = createClasses();
    const {
        ticket: { title, summary },
        ticketTemplate,
    } = props;

    function onChangeTicketTitle(
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) {
        // dispatch the event
        const value = event.target.value as string;
    }

    function onChangeTicketSummary(
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) {
        // dispatch the event
        const value = event.target.value as string;
    }

    return (
        <div css={classes.ticketPreviewContentContainer}>
            <WrappedTextField
                value={title.value}
                label={ticketTemplate.title.label}
                onChange={onChangeTicketTitle}
                error={title.touched ? title.error : ""}
                required
            />
            <WrappedTextField
                value={summary.value}
                label={ticketTemplate.summary.label}
                onChange={onChangeTicketSummary}
                error={summary.touched ? summary.error : ""}
                required
                multiline
            />
        </div>
    );
}

const createClasses = () => {
    const ticketPreviewContentContainer = css`
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 16px;
    `;

    return {
        ticketPreviewContentContainer,
    };
};
