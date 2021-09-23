import { Box } from "@mui/material";
import { BoardContainer } from "../components/boardContainer";
import { TicketContainer } from "../components/ticketContainer";
import { TicketForBoard } from "../components/ticketForBoard";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { TicketDrawerRoutes } from "../components/ticketDrawerRoutes";
import { useArchivedTickets } from "./hooks/useArchivedTickets";

export function ArchivedTickets() {
    const {
        onUpdateTicket,
        onDeleteTicket,
        isLoadingColumns,
        isLoadingTickets,
        isFirstLoad,
        noMoreTicketsToLoad,
        onReachBottomOfList,
        tickets,
        columns,
    } = useArchivedTickets();

    return (
        <BoardContainer>
            <Box
                sx={{
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    position: "relative",
                }}
            >
                <TicketDrawerRoutes
                    onUpdateTicket={onUpdateTicket}
                    onDeleteTicket={onDeleteTicket}
                    ticketType={TicketType.Done}
                />
                <TicketContainer
                    title="Archived Tickets"
                    showCenterSpinner={
                        isLoadingColumns || (isLoadingTickets && isFirstLoad)
                    }
                    bottomLoadingSpinnerProps={
                        noMoreTicketsToLoad
                            ? undefined
                            : {
                                  showSpinner: isLoadingTickets && !isFirstLoad,
                                  onReachBottomOfList,
                              }
                    }
                >
                    {tickets.map((ticket, index) => {
                        const isFirstTicket = index === 0;
                        const augmentedTicket = {
                            ...ticket,
                            pointValueFromTags: 0,
                        };
                        return (
                            <TicketForBoard
                                key={ticket.itemId}
                                isFirstTicket={isFirstTicket}
                                ticket={augmentedTicket}
                                onDeleteTicket={onDeleteTicket}
                                showCompletedDate
                                ticketType={TicketType.Done}
                                columnOptions={columns}
                                onUpdateTicketColumn={() => {
                                    onDeleteTicket("", ticket.itemId);
                                }}
                                onMoveTicketToBacklog={() => {
                                    onDeleteTicket("", ticket.itemId);
                                }}
                            />
                        );
                    })}
                </TicketContainer>
            </Box>
        </BoardContainer>
    );
}
