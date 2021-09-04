/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useDispatch } from "react-redux";
import { ITicketTemplate } from "../../models/ticketTemplate";
import {
    ITicket,
    updateTicketTitle,
    updateTicketSummary,
} from "../../redux/ticket";
import { WrappedTextField } from "../wrappedTextField";

export interface ITicketProps {
    ticket?: ITicket;
    ticketId: string;
    ticketTemplate: ITicketTemplate;
}

export function Ticket(props: ITicketProps) {
    const dispatch = useDispatch();

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
        const value = event.target.value as string;
        const action = updateTicketTitle({
            value,
            ticketId: props.ticketId,
        });
        dispatch(action);
    }

    function onChangeTicketSummary(
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) {
        const value = event.target.value as string;
        const action = updateTicketSummary({
            value,
            ticketId: props.ticketId,
        });
        dispatch(action);
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
