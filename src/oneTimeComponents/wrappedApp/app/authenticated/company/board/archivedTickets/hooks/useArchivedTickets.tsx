import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Api } from "../../../../../../../../api";
import { useAppRouterParams } from "../../../../../hooks/useAppRouterParams";
import { IColumn } from "../../../../../../../../models/column";
import { ITicket } from "../../../../../../../../models/ticket";
import { ITicketUpdateRequest } from "../../../../../../../../models/ticketUpdateRequest";
import { RouteCreator } from "../../../../../utils/routeCreator";

export function useArchivedTickets() {
    const { boardId, companyId, ticketId } = useAppRouterParams();
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [lastEvaluatedItemId, setLastEvaluatedItemId] = useState<
        undefined | string
    >();
    const [lastEvaluatedBelongsTo, setLastEvaluatedBelongsTo] = useState<
        undefined | string
    >();
    const [noMoreTicketsToLoad, setNoMoreTicketsToLoad] = useState(false);

    const [isLoadingColumns, setIsLoadingColumns] = useState(true);
    const [columns, setColumns] = useState<IColumn[]>([]);
    useEffect(() => {
        let didCancel = false;

        Api.columns
            .getColumns(companyId, boardId)
            .then((columnsFromDatabase) => {
                if (didCancel) return;
                setColumns(columnsFromDatabase);
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingColumns(false);
            });

        return () => {
            didCancel = true;
        };
    }, []);

    const [tickets, setTickets] = useState<ITicket[]>([]);
    useEffect(() => {
        if (!isLoadingTickets || !companyId || !boardId || noMoreTicketsToLoad)
            return;

        let didCancel = false;

        Api.tickets
            .getArchivedTicketsPaginated(
                companyId,
                boardId,
                lastEvaluatedItemId,
                lastEvaluatedBelongsTo
            )
            .then(({ items, lastEvaluatedKey }) => {
                if (didCancel) return;
                setTickets((previousTickets) => {
                    return [...previousTickets, ...items];
                });
                if (!lastEvaluatedKey?.itemId) {
                    setNoMoreTicketsToLoad(true);
                }
                setLastEvaluatedItemId(lastEvaluatedKey?.itemId);
                setLastEvaluatedBelongsTo(lastEvaluatedKey?.belongsTo);
                setIsFirstLoad(false);
            })
            .catch((error) => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
                setIsLoadingTickets(false);
            });

        return () => {
            didCancel = true;
        };
    }, [isLoadingTickets, companyId, boardId, noMoreTicketsToLoad]);

    const history = useHistory();
    function closeDrawer() {
        const route = RouteCreator.archivedTickets(companyId, boardId);
        history.push(route);
    }

    function onDeleteTicket(columnId: string, itemId: string) {
        setTickets((previousTickets) => {
            return previousTickets.filter((compareTicket) => {
                return compareTicket.itemId !== itemId;
            });
        });
        closeDrawer();
    }

    function onReachBottomOfList() {
        if (isLoadingTickets) return;

        setIsLoadingTickets(true);
    }

    function onUpdateTicket(ticketUpdateRequest: ITicketUpdateRequest) {
        setTickets((previousTickets) => {
            return previousTickets.map((compareTicket) => {
                if (compareTicket.shortenedItemId === ticketId) {
                    return {
                        ...compareTicket,
                        ...ticketUpdateRequest,
                    };
                } else {
                    return compareTicket;
                }
            });
        });
    }

    return {
        onUpdateTicket,
        onDeleteTicket,
        isLoadingColumns,
        isLoadingTickets,
        isFirstLoad,
        noMoreTicketsToLoad,
        onReachBottomOfList,
        tickets,
        columns,
    };
}
