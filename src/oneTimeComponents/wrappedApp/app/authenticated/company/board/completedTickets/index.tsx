/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import { TicketForBoard } from "../../../../../../../components/ticketForBoard";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { TicketDrawerRoutes } from "../../../../../../../components/ticketDrawerRoutes";
import { useCompletedTickets } from "./hooks/useCompletedTickets";

export function CompletedTickets() {
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
    } = useCompletedTickets();

    const classes = createClasses();

    return (
        <BoardContainer>
            <div css={classes.pageContainer}>
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
            </div>
        </BoardContainer>
    );
}

const createClasses = () => {
    const pageContainer = css`
        padding: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        position: relative;
    `;

    return {
        pageContainer,
    };
};
