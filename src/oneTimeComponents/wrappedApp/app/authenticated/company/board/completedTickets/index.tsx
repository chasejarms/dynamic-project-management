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
    const [lastEvaluatedKey, setLastEvaluatedKey] = useState<
        string | undefined
    >();
    const [tickets, setTickets] = useState<ITicket[]>([]);
    useEffect(() => {
        if (!isLoadingTickets || !companyId || !boardId) return;

        let didCancel = false;

        Api.tickets
            .getDoneTicketPaginated(companyId, boardId, lastEvaluatedKey)
            .then(({ items }) => {
                if (didCancel) return;
                setTickets((previousTickets) => {
                    return [...previousTickets, ...items];
                });
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
    }, [isLoadingTickets, companyId, boardId]);

    function onDeleteTicket(columnId: string, itemId: string) {
        setTickets((previousTickets) => {
            return previousTickets.filter((compareTicket) => {
                return compareTicket.itemId !== itemId;
            });
        });
    }

    const classes = createClasses();

    return (
        <BoardContainer>
            <div css={classes.pageContainer}>
                <TicketContainer title="Completed Tickets">
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
