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
import { useHistory } from "react-router-dom";
import { useAppRouterParams } from "../../../../hooks/useAppRouterParams";
import { ContentWithDynamicToolbar } from "../components/contentWithDynamicToolbar";
import { RouteCreator } from "../../../../utils/routeCreator";
import { Box } from "@mui/material";

export function BoardHome() {
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

    const history = useHistory();
    const { companyId, boardId } = useAppRouterParams();
    function navigateToTicketCreationPage() {
        const route = RouteCreator.createTicket(companyId, boardId);
        history.push(route);
    }

    function navigateToEditBoardPage() {
        const route = RouteCreator.editBoard(companyId, boardId);
        history.push(route);
    }

    return (
        <BoardContainer>
            {isLoadingData ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <ContentWithDynamicToolbar
                    toolbarContent={
                        <Box
                            sx={{
                                py: 0,
                                px: 3,
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
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
                        </Box>
                    }
                    mainContent={
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: "flex",
                                overflow: "auto",
                                position: "relative",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                }}
                            >
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
                            </Box>
                        </Box>
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
