import { Typography, Box } from "@mui/material";
import { TicketPriorityScore } from "./ticketPriorityScore";

export interface ITicketSummaryHeaderProps {
    ticketId: string;
    ticketTemplateId: string;
}

export function TicketSummaryHeader(props: ITicketSummaryHeaderProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                bgcolor: "grey.200",
                padding: 16,
            }}
        >
            <Typography variant="h6">Ticket Preview</Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TicketPriorityScore
                    ticketTemplateId={props.ticketTemplateId}
                    ticketId={props.ticketId}
                />
            </Box>
        </Box>
    );
}
