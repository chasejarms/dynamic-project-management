/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { Theme, useTheme } from "@material-ui/core";
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
    const theme = useTheme();
    const classes = createClasses(theme);
    const {
        isLoadingRequiredInformation,
        onUpdateTicket,
        onDeleteTicket,
        columns,
        sortedAndMappedTickets,
        onUpdateTicketColumn,
        onMoveTicketToBacklogOrDone,
        onChangeAssignTo,
        users,
    } = useBoardHomeLogic();
    const { url } = useRouteMatch();

    return (
        <BoardContainer>
            {isLoadingRequiredInformation ? (
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
                                                    onUpdateTicketColumn
                                                }
                                                onMarkTicketAsDone={
                                                    onMoveTicketToBacklogOrDone
                                                }
                                                onDeleteTicket={onDeleteTicket}
                                                ticketType={
                                                    TicketType.InProgress
                                                }
                                                onMoveTicketToBacklog={
                                                    onMoveTicketToBacklogOrDone
                                                }
                                                onChangeAssignTo={
                                                    onChangeAssignTo
                                                }
                                                usersForBoard={users}
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

const createClasses = (theme: Theme) => {
    const centerContent = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
    `;

    const toolbarContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-start;
        padding: 16px;
        padding-left: 32px;
        flex: 0 0 auto;
    `;

    const chipsContainer = css`
        display: inline;
    `;

    const contentContainer = css`
        flex-grow: 1;
        display: flex;
        overflow-y: auto;
        position: relative;
    `;

    const drawerContainer = css`
        position: absolute;
        right: 0;
        z-index: 1;
        display: grid;
        grid-template-columns: auto 400px;
        height: 100%;
        width: 100%;
    `;

    const drawerDarkOpacityContainer = css`
        background-color: rgba(0, 0, 0, 0.5);
    `;

    const drawerContentContainer = css`
        background-color: white;
        box-shadow: 0px 8px 10px -5px rgb(0 0 0 / 20%),
            0px 16px 24px 2px rgb(0 0 0 / 14%),
            0px 6px 30px 5px rgb(0 0 0 / 12%);
        display: grid;
        grid-template-rows: auto 1fr auto;
    `;

    const drawerHeaderContainer = css`
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px 0 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    `;

    const drawerInnerContentContainer = css`
        padding: 16px;
    `;

    const drawerActionButtonContainer = css`
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        height: 60px;
        overflow: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
    `;

    return {
        centerContent,
        toolbarContainer,
        chipsContainer,
        contentContainer,
        drawerContainer,
        drawerDarkOpacityContainer,
        drawerContentContainer,
        drawerHeaderContainer,
        drawerInnerContentContainer,
        drawerActionButtonContainer,
    };
};
