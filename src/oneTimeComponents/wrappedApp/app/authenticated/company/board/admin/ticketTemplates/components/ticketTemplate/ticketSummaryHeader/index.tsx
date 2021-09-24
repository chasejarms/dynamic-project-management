import { Typography, Box, Divider } from "@mui/material";
import { TicketPriorityScore } from "./ticketPriorityScore";

export interface ITicketSummaryHeaderProps {
    ticketId: string;
    ticketTemplateId: string;
}

export function TicketSummaryHeader(props: ITicketSummaryHeaderProps) {
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
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
            <Divider />
        </Box>
    );
}
