/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { IconButton, Theme, Typography, useTheme } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { sortBy } from "lodash";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../api";
import { BoardColumnsContainer } from "../../../../../../../components/boardColumnsContainer";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import {
    IAugmentedUITicket,
    TicketForBoard,
} from "../../../../../../../components/ticketForBoard";
import {
    doneColumnReservedId,
    uncategorizedColumnReservedId,
} from "../../../../../../../constants/reservedColumnIds";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { IColumn } from "../../../../../../../models/column";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { IUser } from "../../../../../../../models/user";
import { createColumnsMapping } from "../../../../../../../utils/createColumnsMapping";
import { sortTickets } from "../../../../../../../utils/sortTickets";
import { ITicketTemplate } from "../../../../../../../models/ticketTemplate";
import { Route, useRouteMatch, useHistory } from "react-router-dom";
import { TicketDrawerHome } from "../../../../../../../components/ticketDrawerHome";
import { ITicketUpdateRequest } from "../../../../../../../models/ticketUpdateRequest";

export function BoardHome() {
    const { companyId, boardId } = useAppRouterParams();
    const { url } = useRouteMatch();

    const [columns, setColumns] = useState<IColumn[]>([]);
    const [sortedAndMappedTickets, setSortedAndMappedTickets] = useState<{
        [columnId: string]: {
            columnInformation: IColumn;
            tickets: IAugmentedUITicket[];
        };
    }>({});

    const [
        isLoadingRequiredInformation,
        setIsLoadingRequiredInformation,
    ] = useState(true);

    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (!companyId || !boardId) return;

        let didCancel = false;

        Promise.all([
            Api.columns.getColumns(companyId, boardId),
            Api.tickets.getInProgressTickets(companyId, boardId),
            Api.users.getAllUsersForCompany(companyId),
            Api.ticketTemplates.getTicketTemplatesForBoard(companyId, boardId),
        ])
            .then(
                ([
                    columnsFromDatabase,
                    inProgressTickets,
                    usersFromDatabase,
                    ticketTemplates,
                ]) => {
                    if (didCancel) return;

                    const ticketTemplatesMapping: {
                        [
                            ticketTemplateShortenedItemId: string
                        ]: ITicketTemplate;
                    } = {};
                    ticketTemplates.forEach((ticketTemplate) => {
                        ticketTemplatesMapping[
                            ticketTemplate.shortenedItemId
                        ] = ticketTemplate;
                    });

                    const sortedUsers = sortBy(usersFromDatabase, "name");
                    setUsers(sortedUsers);

                    const columnsMapping = createColumnsMapping(
                        columnsFromDatabase,
                        inProgressTickets,
                        ticketTemplatesMapping
                    );

                    setSortedAndMappedTickets(columnsMapping);
                    setColumns(columnsFromDatabase);
                }
            )
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingRequiredInformation(false);
            });

        return () => {
            didCancel = true;
        };
    }, [companyId, boardId]);

    function onUpdateTicketColumn(
        previousColumnId: string,
        updatedTicket: IAugmentedUITicket
    ) {
        setSortedAndMappedTickets((previousSortedAndMappedTickets) => {
            const columnOfOldTicket =
                previousSortedAndMappedTickets[previousColumnId];
            const columnForUpdatedTicket =
                previousSortedAndMappedTickets[updatedTicket.columnId!];

            const oldColumnTicketsWithoutUpdatedTicket = columnOfOldTicket.tickets.filter(
                (ticket) => ticket.itemId !== updatedTicket.itemId
            );
            const sortedNewColumnTicketsWithUpdatedTicket = sortTickets(
                columnForUpdatedTicket.tickets.concat([updatedTicket])
            );

            return {
                ...previousSortedAndMappedTickets,
                [previousColumnId]: {
                    ...columnOfOldTicket,
                    tickets: oldColumnTicketsWithoutUpdatedTicket,
                },
                [updatedTicket.columnId!]: {
                    ...columnForUpdatedTicket,
                    tickets: sortedNewColumnTicketsWithUpdatedTicket,
                },
            };
        });
    }

    function onDeleteTicket(columnId: string, itemId: string) {
        setSortedAndMappedTickets((previousSortedAndMappedTickets) => {
            const columnIdExists = !!previousSortedAndMappedTickets[columnId];
            const trueColumnId = columnIdExists
                ? columnId
                : uncategorizedColumnReservedId;
            const columnOfTicket = previousSortedAndMappedTickets[trueColumnId];

            const columnWithTicketRemoved = columnOfTicket.tickets.filter(
                (ticket) => ticket.itemId !== itemId
            );

            return {
                ...previousSortedAndMappedTickets,
                [trueColumnId]: {
                    ...columnOfTicket,
                    tickets: columnWithTicketRemoved,
                },
            };
        });
    }

    function onMoveTicketToBacklogOrDone(columnId: string, itemId: string) {
        setSortedAndMappedTickets((previousSortedAndMappedTickets) => {
            const columnIdExists = !!previousSortedAndMappedTickets[columnId];
            const trueColumnId = columnIdExists
                ? columnId
                : uncategorizedColumnReservedId;
            const columnOfTicket = previousSortedAndMappedTickets[trueColumnId];

            const columnWithTicketRemoved = columnOfTicket.tickets.filter(
                (ticket) => ticket.itemId !== itemId
            );

            return {
                ...previousSortedAndMappedTickets,
                [trueColumnId]: {
                    ...columnOfTicket,
                    tickets: columnWithTicketRemoved,
                },
            };
        });
    }

    function onChangeAssignTo(ticket: IAugmentedUITicket) {
        setSortedAndMappedTickets((previousSortedAndMappedTickets) => {
            const { columnId } = ticket;
            const columnIdExists = !!previousSortedAndMappedTickets[columnId];
            const trueColumnId = columnIdExists
                ? columnId
                : uncategorizedColumnReservedId;
            const columnOfTicket = previousSortedAndMappedTickets[trueColumnId];

            const updatedTickets = columnOfTicket.tickets.map(
                (compareTicket) => {
                    const isSameTicket = compareTicket.itemId === ticket.itemId;
                    if (isSameTicket) {
                        return ticket;
                    } else {
                        return compareTicket;
                    }
                }
            );

            return {
                ...previousSortedAndMappedTickets,
                [trueColumnId]: {
                    ...columnOfTicket,
                    tickets: updatedTickets,
                },
            };
        });
    }

    const history = useHistory();
    function closeDrawer() {
        history.push(`/app/company/${companyId}/board/${boardId}/tickets`);
    }

    const theme = useTheme();
    const classes = createClasses(theme);
    function onUpdateTicket(ticketUpdateRequest: ITicketUpdateRequest) {}

    return (
        <BoardContainer>
            {isLoadingRequiredInformation ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.contentContainer}>
                    <Route path={`${url}/:ticketId`}>
                        <TicketDrawerHome onUpdateTicket={onUpdateTicket} />
                    </Route>
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
