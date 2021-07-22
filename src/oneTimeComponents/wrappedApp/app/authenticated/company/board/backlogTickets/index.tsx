/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { useAppRouterParams } from "../../../../../../../hooks/useAppRouterParams";
import { Api } from "../../../../../../../api";
import { BoardContainer } from "../../../../../../../components/boardContainer";
import { TicketContainer } from "../../../../../../../components/ticketContainer";
import {
    IAugmentedUITicket,
    TicketForBoard,
} from "../../../../../../../components/ticketForBoard";
import { IColumn } from "../../../../../../../models/column";
import { TicketType } from "../../../../../../../models/ticket/ticketType";
import { prioritiesToPointValueMapping } from "../../../../../../../utils/prioritiesToPointValueMapping";
import { sortTickets } from "../../../../../../../utils/sortTickets";
import { ticketsToAugmentedUITickets } from "../../../../../../../utils/ticketsToAugmentedUITickets";

export function BacklogTickets() {
    const { boardId, companyId } = useAppRouterParams();
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [sortedTickets, setSortedTickets] = useState<IAugmentedUITicket[]>(
        []
    );
    const [columns, setColumns] = useState<IColumn[]>([]);
    useEffect(() => {
        if (!isLoadingTickets || !companyId || !boardId) return;

        let didCancel = false;

        Promise.all([
            Api.tickets.getBacklogTickets(companyId, boardId),
            Api.priorities.getPrioritiesForBoard(companyId, boardId),
            Api.columns.getColumns(companyId, boardId),
        ])
            .then(([tickets, priorities, columnsFromDatabase]) => {
                if (didCancel) return;
                const prioritiesToPointValueMappingLocal = prioritiesToPointValueMapping(
                    priorities
                );
                const augmentedUITickets = ticketsToAugmentedUITickets(
                    tickets,
                    prioritiesToPointValueMappingLocal
                );
                const sortedTicketsAfterRequest = sortTickets(
                    augmentedUITickets
                );
                setSortedTickets(sortedTicketsAfterRequest);
                setColumns(columnsFromDatabase);
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
        setSortedTickets((previousSortedTickets) => {
            return previousSortedTickets.filter((ticket) => {
                return ticket.itemId !== itemId;
            });
        });
    }

    const classes = createClasses();

    return (
        <BoardContainer>
            <div css={classes.pageContainer}>
                <TicketContainer
                    title="Backlog Tickets"
                    showCenterSpinner={isLoadingTickets}
                >
                    {sortedTickets.length > 0 ? (
                        sortedTickets.map((ticket, index) => {
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
                                    ticketType={TicketType.Backlog}
                                    adjustColumnOptions={{
                                        columnOptions: columns,
                                        onMarkTicketAsDone: () => {
                                            onDeleteTicket("", ticket.itemId);
                                        },
                                        onUpdateTicketColumn: () => {
                                            onDeleteTicket("", ticket.itemId);
                                        },
                                    }}
                                />
                            );
                        })
                    ) : (
                        <div css={classes.noTicketsContainer}>
                            <div css={classes.noTicketsTextContainer}>
                                <Typography>
                                    There are currently no tickets in the
                                    backlog
                                </Typography>
                            </div>
                        </div>
                    )}
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

    const noTicketsContainer = css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const noTicketsTextContainer = css`
        text-align: center;
    `;

    return {
        pageContainer,
        noTicketsContainer,
        noTicketsTextContainer,
    };
};
