/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, Typography, useTheme } from "@material-ui/core";
import { TicketPriorityScore } from "./ticketPriorityScore";

export interface ITicketSummaryHeaderProps {
    ticketId: string;
    ticketTemplateId: string;
}

export function TicketSummaryHeader(props: ITicketSummaryHeaderProps) {
    const theme = useTheme();
    const classes = createClasses(theme);
    return (
        <div css={classes.ticketPreviewHeaderContainer}>
            <Typography variant="h6">Ticket Preview</Typography>
            <div css={classes.priorityScoreContainer}>
                <TicketPriorityScore
                    ticketTemplateId={props.ticketTemplateId}
                    ticketId={props.ticketId}
                />
            </div>
        </div>
    );
}

const createClasses = (theme: Theme) => {
    const ticketPreviewHeaderContainer = css`
        display: flex;
        justify-content: space-between;
        background-color: ${theme.palette.grey["200"]};
        padding: 16px;
    `;

    const priorityScoreContainer = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return {
        ticketPreviewHeaderContainer,
        priorityScoreContainer,
    };
};
