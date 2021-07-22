/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../api";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { CenterLoadingSpinner } from "../../../../../../../components/centerLoadingSpinner";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import {
    IAugmentedUITicket,
    TicketForBoard,
} from "../../../../../../../components/ticketForBoard";
import { uncategorizedColumnReservedId } from "../../../../../../../constants/reservedColumnIds";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { IColumn } from "../../../../../../../models/column";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { prioritiesToPointValueMapping } from "../../../../../../../utils/prioritiesToPointValueMapping";
import { sortTickets } from "../../../../../../../utils/sortTickets";
import { ticketsToAugmentedUITickets } from "../../../../../../../utils/ticketsToAugmentedUITickets";

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

    useEffect(() => {
        if (!companyId || !boardId) return;

        let didCancel = false;

        Promise.all([
            Api.columns.getColumns(companyId, boardId),
            Api.tickets.getInProgressTickets(companyId, boardId),
            Api.priorities.getPrioritiesForBoard(companyId, boardId),
        ])
            .then(([columnsFromDatabase, inProgressTickets, priorities]) => {
                if (didCancel) return;

                const prioritiesToPointValueMappingLocal = prioritiesToPointValueMapping(
                    priorities
                );

                const columnsMapping = columnsFromDatabase.reduce<{
                    [columnId: string]: {
                        columnInformation: IColumn;
                        tickets: IAugmentedUITicket[];
                    };
                }>((mapping, columnFromDatabase) => {
                    mapping[columnFromDatabase.id] = {
                        columnInformation: columnFromDatabase,
                        tickets: [],
                    };
                    return mapping;
                }, {});

                const augmentedUITickets = ticketsToAugmentedUITickets(
                    inProgressTickets,
                    prioritiesToPointValueMappingLocal
                );
                augmentedUITickets.forEach((ticketForUI) => {
                    const columnId = ticketForUI.columnId;
                    if (columnId && !!columnsMapping[columnId]) {
                        columnsMapping[columnId].tickets.push(ticketForUI);
                    } else {
                        columnsMapping[
                            uncategorizedColumnReservedId
                        ].tickets.push(ticketForUI);
                    }
                });

                Object.keys(columnsMapping).forEach((columnId) => {
                    columnsMapping[columnId].tickets = sortTickets(
                        columnsMapping[columnId].tickets
                    );
                });

                setSortedAndMappedTickets(columnsMapping);
                setColumns(columnsFromDatabase);
            })
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

    function onMarkTicketAsDone(columnId: string, itemId: string) {
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

    const classes = createClasses();

    return (
        <BoardContainer>
            {isLoadingRequiredInformation ? (
                <CenterLoadingSpinner size="large" />
            ) : (
                <div css={classes.boardContainer}>
                    <div css={classes.columnsContainer}>
                        {columns.map((column) => {
                            const isUncategorizedSection =
                                column.id === uncategorizedColumnReservedId;
                            const hasNoTickets =
                                sortedAndMappedTickets[column.id].tickets
                                    .length === 0;
                            if (isUncategorizedSection && hasNoTickets) {
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
                                                adjustColumnOptions={{
                                                    columnOptions: columns,
                                                    onUpdateTicketColumn,
                                                    onMarkTicketAsDone,
                                                }}
                                                onDeleteTicket={onDeleteTicket}
                                                ticketType={
                                                    TicketType.InProgress
                                                }
                                            />
                                        );
                                    })}
                                </TicketContainer>
                            );
                        })}
                    </div>
                </div>
            )}
        </BoardContainer>
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

    const boardContainer = css`
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `;

    const toolbarContainer = css`
        width: 100%;
        display: flex;
        justify-content: flex-start;
        padding: 16px;
        padding-left: 32px;
        flex: 0 0 auto;
    `;

    const columnsContainer = css`
        width: 100%;
        overflow-x: auto;
        display: flex;
        flex-grow: 1;
        padding: 24px;
    `;

    const chipsContainer = css`
        display: inline;
    `;

    return {
        centerContent,
        boardContainer,
        toolbarContainer,
        columnsContainer,
        chipsContainer,
    };
};
