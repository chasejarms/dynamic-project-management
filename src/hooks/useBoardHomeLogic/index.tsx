import { sortBy, cloneDeep } from "lodash";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Api } from "../../api";
import { IAugmentedUITicket } from "../../components/ticketForBoard";
import { uncategorizedColumnReservedId } from "../../constants/reservedColumnIds";
import { IColumn } from "../../models/column";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { ITicketUpdateRequest } from "../../models/ticketUpdateRequest";
import { IUser } from "../../models/user";
import { createColumnsMapping } from "../../utils/createColumnsMapping";
import { sortTickets } from "../../utils/sortTickets";
import { ticketsToAugmentedUITickets } from "../../utils/ticketsToAugmentedUITickets";
import { useAppRouterParams } from "../useAppRouterParams";

export function useBoardHomeLogic() {
    const { companyId, boardId, ticketId } = useAppRouterParams();

    const [columns, setColumns] = useState<IColumn[]>([]);
    const [sortedAndMappedTickets, setSortedAndMappedTickets] = useState<{
        [columnId: string]: {
            columnInformation: IColumn;
            tickets: IAugmentedUITicket[];
        };
    }>({});

    const [
        cachedTicketTemplatesMapping,
        setCachedTicketTemplatesMapping,
    ] = useState<{
        [ticketTemplateShortenedItemId: string]: ITicketTemplate;
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
                    setCachedTicketTemplatesMapping(ticketTemplatesMapping);

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

        closeDrawer();
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

    function onUpdateTicket(ticketUpdateRequest: ITicketUpdateRequest) {
        setSortedAndMappedTickets((previousSortedAndMappedTickets) => {
            const clone = cloneDeep(previousSortedAndMappedTickets);
            const updatedSortedAndMappedTickets = Object.keys(clone).reduce<{
                [columnId: string]: {
                    columnInformation: IColumn;
                    tickets: IAugmentedUITicket[];
                };
            }>((mapping, columnId) => {
                const existingData = clone[columnId];
                const updatedTickets = clone[columnId].tickets.map((ticket) => {
                    if (ticket.shortenedItemId === ticketId) {
                        const updatedTicket: IAugmentedUITicket = {
                            ...ticket,
                            ...ticketUpdateRequest,
                        };

                        const augmentedUITickets = ticketsToAugmentedUITickets(
                            [updatedTicket],
                            cachedTicketTemplatesMapping
                        );

                        return augmentedUITickets[0];
                    } else {
                        return ticket;
                    }
                });
                const sortedUpdatedTickets = sortTickets(updatedTickets);

                const updatedMapping = {
                    ...existingData,
                    tickets: sortedUpdatedTickets,
                };

                mapping[columnId] = updatedMapping;
                return mapping;
            }, {});

            return updatedSortedAndMappedTickets;
        });
    }

    return {
        isLoadingRequiredInformation,
        onUpdateTicket,
        onDeleteTicket,
        columns,
        sortedAndMappedTickets,
        onUpdateTicketColumn,
        onMoveTicketToBacklogOrDone,
        onChangeAssignTo,
        users,
    };
}
