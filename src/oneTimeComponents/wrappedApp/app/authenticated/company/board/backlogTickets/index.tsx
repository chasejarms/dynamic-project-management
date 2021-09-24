import { Typography, Box } from "@mui/material";
import { TicketContainer } from "../components/ticketContainer";
import { TicketForBoard } from "../components/ticketForBoard";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { BoardContainer } from "../components/boardContainer";
import { useNonArchivedBoardLogic } from "../hooks/useNonArchivedBoardLogic";
import { backlogColumnReservedId } from "../../../../../../../constants/reservedColumnIds";
import { TicketDrawerRoutes } from "../components/ticketDrawerRoutes";

export function BacklogTickets() {
    const {
        isLoadingData,
        onUpdateTicket,
        onDeleteTicket,
        columns,
        sortedAndMappedTickets,
        onRemoveTicketFromCurrentUI,
    } = useNonArchivedBoardLogic(TicketType.Backlog);

    const backlogTickets =
        sortedAndMappedTickets[backlogColumnReservedId]?.tickets || [];

    return (
        <BoardContainer>
            <Box
                sx={{
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    position: "relative",
                    height: "100%",
                }}
            >
                <TicketDrawerRoutes
                    onUpdateTicket={onUpdateTicket}
                    onDeleteTicket={onDeleteTicket}
                    ticketType={TicketType.Backlog}
                />
                <TicketContainer
                    title="Backlog Tickets"
                    showCenterSpinner={isLoadingData}
                >
                    {backlogTickets.length > 0 ? (
                        backlogTickets.map((ticket, index) => {
                            const isFirstTicket = index === 0;
                            return (
                                <TicketForBoard
                                    key={ticket.itemId}
                                    isFirstTicket={isFirstTicket}
                                    ticket={ticket}
                                    onDeleteTicket={onDeleteTicket}
                                    ticketType={TicketType.Backlog}
                                    columnOptions={columns}
                                    onMarkTicketAsDone={() => {
                                        onDeleteTicket("", ticket.itemId);
                                    }}
                                    onUpdateTicketColumn={() => {
                                        onDeleteTicket("", ticket.itemId);
                                    }}
                                />
                            );
                        })
                    ) : (
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                <Typography>
                                    There are currently no tickets in the
                                    backlog
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </TicketContainer>
            </Box>
        </BoardContainer>
    );
}
