/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { BoardColumnsContainer } from "./components/boardColumnsContainer";
import { CenterLoadingSpinner } from "../../../components/centerLoadingSpinner";
import { BoardContainer } from "../components/boardContainer";
import { TicketContainer } from "../components/ticketContainer";
import { TicketForBoard } from "../components/ticketForBoard";
import {
    doneColumnReservedId,
    uncategorizedColumnReservedId,
} from "../../../../../../../constants/reservedColumnIds";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { useNonArchivedBoardLogic } from "../hooks/useNonArchivedBoardLogic";
import { TicketDrawerRoutes } from "../components/ticketDrawerRoutes";
import { WrappedButton } from "../../../../components/wrappedButton";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useAppRouterParams } from "../../../../hooks/useAppRouterParams";
import { ContentWithDynamicToolbar } from "../components/contentWithDynamicToolbar";

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
        onCreateTicket,
    } = useNonArchivedBoardLogic(TicketType.InProgress);
    const { url } = useRouteMatch();

    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();
    function navigateToTicketCreationPage() {
        history.push(
            `/app/company/${companyId}/board/${boardId}/tickets/create-ticket`
        );
    }

    function navigateToEditBoardPage() {
        history.push(`/app/company/${companyId}/board/${boardId}/edit-board`);
    }

    return (
        <BoardContainer>
            {isLoadingData ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <ContentWithDynamicToolbar
                    toolbarContent={
                        <div css={classes.actionButtonContainer}>
                            <div>
                                <WrappedButton
                                    variant="outlined"
                                    onClick={navigateToTicketCreationPage}
                                    color="primary"
                                >
                                    Create Ticket
                                </WrappedButton>
                            </div>
                            <div>
                                <WrappedButton
                                    variant="text"
                                    onClick={navigateToEditBoardPage}
                                    color="primary"
                                >
                                    Edit Board
                                </WrappedButton>
                            </div>
                        </div>
                    }
                    mainContent={
                        <div css={classes.contentContainer}>
                            <div css={classes.columnsContainer}>
                                <BoardColumnsContainer removeTopPadding>
                                    {columns.map((column) => {
                                        const isDoneColumn =
                                            column.id === doneColumnReservedId;
                                        const isUncategorizedSection =
                                            column.id ===
                                            uncategorizedColumnReservedId;
                                        const hasNoTickets =
                                            sortedAndMappedTickets[column.id]
                                                .tickets.length === 0;
                                        if (
                                            isDoneColumn ||
                                            (isUncategorizedSection &&
                                                hasNoTickets)
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
                                                ].tickets.map(
                                                    (ticket, index) => {
                                                        const isFirstCard =
                                                            index === 0;
                                                        return (
                                                            <TicketForBoard
                                                                key={
                                                                    ticket.itemId
                                                                }
                                                                ticket={ticket}
                                                                isFirstTicket={
                                                                    isFirstCard
                                                                }
                                                                columnOptions={
                                                                    columns
                                                                }
                                                                onUpdateTicketColumn={
                                                                    onUpdateInProgressTicketColumn
                                                                }
                                                                onMarkTicketAsDone={
                                                                    onRemoveTicketFromCurrentUI
                                                                }
                                                                onDeleteTicket={
                                                                    onDeleteTicket
                                                                }
                                                                ticketType={
                                                                    TicketType.InProgress
                                                                }
                                                                onMoveTicketToBacklog={
                                                                    onRemoveTicketFromCurrentUI
                                                                }
                                                                onChangeAssignTo={
                                                                    onChangeAssignTo
                                                                }
                                                                usersForBoard={
                                                                    allCompanyUsers
                                                                }
                                                            />
                                                        );
                                                    }
                                                )}
                                            </TicketContainer>
                                        );
                                    })}
                                </BoardColumnsContainer>
                            </div>
                        </div>
                    }
                    ticketDrawerRoutes={
                        <TicketDrawerRoutes
                            onUpdateTicket={onUpdateTicket}
                            onDeleteTicket={onDeleteTicket}
                            onCreateTicket={onCreateTicket}
                            ticketType={TicketType.InProgress}
                        />
                    }
                />
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
        flex-direction: column;
    `;

    const actionButtonContainer = css`
        padding: 0px 24px 0 24px;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;

    const columnsContainer = css`
        flex-grow: 1;
        display: flex;
    `;

    return {
        contentContainer,
        actionButtonContainer,
        columnsContainer,
    };
};
