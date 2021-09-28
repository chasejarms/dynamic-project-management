import { Typography, Box, Divider } from "@mui/material";
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
            }}
        >
            <Box
                sx={{
                    paddingBottom: 2,
                }}
            >
                <Typography variant="h5">Ticket Preview</Typography>
            </Box>
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
