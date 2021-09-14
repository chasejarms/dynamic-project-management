/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { BoardColumnsContainer } from "../../../../../../../components/boardColumnsContainer";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import { TicketForBoard } from "../../../../../../../components/ticketForBoard";
import {
    doneColumnReservedId,
    uncategorizedColumnReservedId,
} from "../../../../../../../constants/reservedColumnIds";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { TicketHome } from "../ticket/ticketHome";
import { TicketImages } from "../ticket/ticketImages";
import { useBoardHomeLogic } from "../../../../../../../hooks/useBoardHomeLogic";

export function BoardHome() {
    const classes = createClasses();
    const {
        isLoadingData,
        onUpdateTicket,
        onDeleteTicket,
        columns,
        sortedAndMappedTickets,
        onUpdateInProgressTicketColumn,
        onRemoveTicketFromCurrentUI,
        onChangeAssignTo,
        allCompanyUsers,
    } = useBoardHomeLogic(TicketType.InProgress);
    const { url } = useRouteMatch();

    return (
        <BoardContainer>
            {isLoadingData ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.contentContainer}>
                    <Switch>
                        <Route path={`${url}/:ticketId/data`} exact>
                            <TicketHome
                                onUpdateTicket={onUpdateTicket}
                                onDeleteTicket={onDeleteTicket}
                                ticketType={TicketType.InProgress}
                            />
                        </Route>
                        <Route path={`${url}/:ticketId/images`} exact>
                            <TicketImages ticketType={TicketType.InProgress} />
                        </Route>
                    </Switch>
                    <BoardColumnsContainer>
                        {columns.map((column) => {
                            const isDoneColumn =
                                column.id === doneColumnReservedId;
                            const isUncategorizedSection =
                                column.id === uncategorizedColumnReservedId;
                            const hasNoTickets =
                                sortedAndMappedTickets[column.id].tickets
                                    .length === 0;
                            if (
                                isDoneColumn ||
                                (isUncategorizedSection && hasNoTickets)
                            ) {
                                return null;
                            }

                            return (
                                <TicketContainer
                                    key={column.id}
                                    title={column.name}
                                >
                                    {sortedAndMappedTickets[
                                        column.id
                                    ].tickets.map((ticket, index) => {
                                        const isFirstCard = index === 0;
                                        return (
                                            <TicketForBoard
                                                key={ticket.itemId}
                                                ticket={ticket}
                                                isFirstTicket={isFirstCard}
                                                columnOptions={columns}
                                                onUpdateTicketColumn={
                                                    onUpdateInProgressTicketColumn
                                                }
                                                onMarkTicketAsDone={
                                                    onRemoveTicketFromCurrentUI
                                                }
                                                onDeleteTicket={onDeleteTicket}
                                                ticketType={
                                                    TicketType.InProgress
                                                }
                                                onMoveTicketToBacklog={
                                                    onRemoveTicketFromCurrentUI
                                                }
                                                onChangeAssignTo={
                                                    onChangeAssignTo
                                                }
                                                usersForBoard={allCompanyUsers}
                                            />
                                        );
                                    })}
                                </TicketContainer>
                            );
                        })}
                    </BoardColumnsContainer>
                </div>
            )}
        </BoardContainer>
    );
}

const createClasses = () => {
    const contentContainer = css`
        flex-grow: 1;
        display: flex;
        overflow-y: auto;
        position: relative;
    `;

    return {
        contentContainer,
    };
};
