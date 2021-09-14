/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Typography } from "@material-ui/core";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import { TicketForBoard } from "../../../../../../../components/ticketForBoard";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { Route, Switch } from "react-router-dom";
import { TicketHome } from "../ticket/ticketHome";
import { TicketImages } from "../ticket/ticketImages";
import { url } from "inspector";
import { useNonCompletedBoardLogic } from "../../../../../../../hooks/useNonCompletedBoardLogic";
import { backlogColumnReservedId } from "../../../../../../../constants/reservedColumnIds";

export function BacklogTickets() {
    const {
        isLoadingData,
        onUpdateTicket,
        onDeleteTicket,
        columns,
        sortedAndMappedTickets,
        onRemoveTicketFromCurrentUI,
    } = useNonCompletedBoardLogic(TicketType.InProgress);
    const backlogTickets =
        sortedAndMappedTickets[backlogColumnReservedId].tickets;

    const classes = createClasses();

    return (
        <BoardContainer>
            <div css={classes.pageContainer}>
                <Switch>
                    <Route path={`${url}/:ticketId/data`} exact>
                        <TicketHome
                            onUpdateTicket={onUpdateTicket}
                            onDeleteTicket={onDeleteTicket}
                            ticketType={TicketType.Backlog}
                        />
                    </Route>
                    <Route path={`${url}/:ticketId/images`} exact>
                        <TicketImages ticketType={TicketType.Backlog} />
                    </Route>
                </Switch>
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
                                    onMarkTicketAsDone={
                                        onRemoveTicketFromCurrentUI
                                    }
                                    onUpdateTicketColumn={() => {
                                        onDeleteTicket("", ticket.itemId);
                                    }}
                                />
                            );
                        })
                    ) : (
                        <div css={classes.noTicketsContainer}>
                            <div css={classes.noTicketsTextContainer}>
                                <Typography>
                                    There are currently no tickets in the
                                    backlog
                                </Typography>
                            </div>
                        </div>
                    )}
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

    const noTicketsContainer = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const noTicketsTextContainer = css`
        text-align: center;
    `;

    return {
        pageContainer,
        noTicketsContainer,
        noTicketsTextContainer,
    };
};
