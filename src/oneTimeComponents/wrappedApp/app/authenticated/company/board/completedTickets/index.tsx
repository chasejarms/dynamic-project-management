/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Api } from "../../../../../../../api";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import { TicketForBoard } from "../../../../../../../components/ticketForBoard";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { IColumn } from "../../../../../../../models/column";
import { ITicket } from "../../../../../../../models/ticket";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { TicketHome } from "../ticket/ticketHome";
import { TicketImages } from "../ticket/ticketImages";
import { ITicketUpdateRequest } from "../../../../../../../models/ticketUpdateRequest";
import { useHistory } from "react-router-dom";

export function CompletedTickets() {
    const { url } = useRouteMatch();

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
            .getDoneTicketPaginated(
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
        history.push(
            `/app/company/${companyId}/board/${boardId}/archived-tickets`
        );
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

    const classes = createClasses();

    return (
        <BoardContainer>
            <div css={classes.pageContainer}>
                <Switch>
                    <Route path={`${url}/:ticketId/data`} exact>
                        <TicketHome
                            onUpdateTicket={onUpdateTicket}
                            onDeleteTicket={onDeleteTicket}
                            ticketType={TicketType.Done}
                        />
                    </Route>
                    <Route path={`${url}/:ticketId/images`} exact>
                        <TicketImages ticketType={TicketType.Done} />
                    </Route>
                </Switch>
                <TicketContainer
                    title="Archived Tickets"
                    showCenterSpinner={
                        isLoadingColumns || (isLoadingTickets && isFirstLoad)
                    }
                    bottomLoadingSpinnerProps={
                        noMoreTicketsToLoad
                            ? undefined
                            : {
                                  showSpinner: isLoadingTickets && !isFirstLoad,
                                  onReachBottomOfList,
                              }
                    }
                >
                    {tickets.map((ticket, index) => {
                        const isFirstTicket = index === 0;
                        const augmentedTicket = {
                            ...ticket,
                            pointValueFromTags: 0,
                        };
                        return (
                            <TicketForBoard
                                key={ticket.itemId}
                                isFirstTicket={isFirstTicket}
                                ticket={augmentedTicket}
                                onDeleteTicket={onDeleteTicket}
                                showCompletedDate
                                ticketType={TicketType.Done}
                                columnOptions={columns}
                                onUpdateTicketColumn={() => {
                                    onDeleteTicket("", ticket.itemId);
                                }}
                                onMoveTicketToBacklog={() => {
                                    onDeleteTicket("", ticket.itemId);
                                }}
                            />
                        );
                    })}
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

    return {
        pageContainer,
    };
};
