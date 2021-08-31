/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../api";
import { TagsBoardContainer } from "../../../../../../../components/tagsBoardContainer";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import { TicketForBoard } from "../../../../../../../components/ticketForBoard";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { IColumn } from "../../../../../../../models/column";
import { ITicket } from "../../../../../../../models/ticket";
import { TicketType } from "../../../../../../../models/ticket/ticketType";

export function CompletedTickets() {
    const { boardId, companyId } = useAppRouterParams();
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

    function onDeleteTicket(columnId: string, itemId: string) {
        setTickets((previousTickets) => {
            return previousTickets.filter((compareTicket) => {
                return compareTicket.itemId !== itemId;
            });
        });
    }

    function onReachBottomOfList() {
        if (isLoadingTickets) return;

        setIsLoadingTickets(true);
    }

    const classes = createClasses();

    return (
        <TagsBoardContainer>
            <div css={classes.pageContainer}>
                <TicketContainer
                    title="Completed Tickets"
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
        </TagsBoardContainer>
    );
}

const createClasses = () => {
    const pageContainer = css`
        padding: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    `;

    return {
        pageContainer,
    };
};
