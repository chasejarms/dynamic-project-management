/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { sortBy } from "lodash";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../api";
import { BoardColumnsContainer } from "../../../../../../../components/boardColumnsContainer";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import { TagsBoardContainer } from "../../../../../../../components/tagsBoardContainer";
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

export function BoardHome() {
    const { companyId, boardId } = useAppRouterParams();

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
            Api.priorities.getPrioritiesForBoard(companyId, boardId),
            Api.users.getAllUsersForBoard(companyId, boardId),
        ])
            .then(
                ([
                    columnsFromDatabase,
                    inProgressTickets,
                    priorities,
                    usersFromDatabase,
                ]) => {
                    if (didCancel) return;

                    const sortedUsers = sortBy(usersFromDatabase, "name");
                    setUsers(sortedUsers);

                    const columnsMapping = createColumnsMapping(
                        priorities,
                        columnsFromDatabase,
                        inProgressTickets
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

    const classes = createClasses();

    return (
        <TagsBoardContainer>
            {isLoadingRequiredInformation ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <BoardColumnsContainer>
                    {columns.map((column) => {
                        const isDoneColumn = column.id === doneColumnReservedId;
                        const isUncategorizedSection =
                            column.id === uncategorizedColumnReservedId;
                        const hasNoTickets =
                            sortedAndMappedTickets[column.id].tickets.length ===
                            0;
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
                                {sortedAndMappedTickets[column.id].tickets.map(
                                    (ticket, index) => {
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
                                    }
                                )}
                            </TicketContainer>
                        );
                    })}
                </BoardColumnsContainer>
            )}
        </TagsBoardContainer>
    );
}

const createClasses = () => {
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

    return {
        centerContent,
        toolbarContainer,
        chipsContainer,
    };
};
