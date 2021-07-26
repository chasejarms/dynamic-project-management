/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Api } from "../../../../../../../api";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import { TicketForBoard } from "../../../../../../../components/ticketForBoard";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
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
        <BoardContainer>
            <div css={classes.pageContainer}>
                <TicketContainer
                    title="Completed Tickets"
                    showCenterSpinner={isLoadingTickets && isFirstLoad}
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
    `;

    return {
        pageContainer,
    };
};
