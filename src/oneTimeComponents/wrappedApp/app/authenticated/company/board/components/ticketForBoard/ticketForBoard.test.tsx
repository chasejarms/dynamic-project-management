import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TicketForBoard } from ".";
import { TicketType } from "../../../../../../../../models/ticket/ticketType";
import { RouteCreator } from "../../../../../utils/routeCreator";
import { defaultHiddenPriorityScoreValue } from "../../utils/ticketsToAugmentedUITickets";
import { ticketForBoardTestIds } from "./ticketForBoard.testIds";

describe("TicketForBoard", () => {
    describe("the priority score is equal to defaultHiddenPriorityScoreValue", () => {
        it("should NOT display the priority score", () => {
            render(
                <MemoryRouter
                    initialEntries={[
                        RouteCreator.inProgressTickets("123", "456"),
                    ]}
                >
                    <TicketForBoard
                        key={"1"}
                        isFirstTicket={false}
                        ticket={{
                            shortenedItemId: "",
                            title: "Ticket Name",
                            summary: "Ticket Summary",
                            sections: [],
                            ticketTemplateShortenedItemId: "",
                            createdTimestamp: "",
                            lastModifiedTimestamp: "",
                            completedTimestamp: "",
                            columnId: "",
                            directAccessTicketId: "",
                            pointValueFromTags: defaultHiddenPriorityScoreValue,
                            itemId: "",
                            belongsTo: "",
                        }}
                        onDeleteTicket={() => null}
                        showCompletedDate
                        ticketType={TicketType.InProgress}
                        columnOptions={[]}
                        onUpdateTicketColumn={() => null}
                        onMoveTicketToBacklog={() => null}
                    />
                </MemoryRouter>
            );

            const priorityScoreValueContainer = screen.queryByTestId(
                ticketForBoardTestIds.pointValueFromTagsContainer
            );
            expect(priorityScoreValueContainer).toBeNull();
        });
    });

    describe("the priority score is equal to Infinity", () => {
        it("should display MAX for the priority score", () => {
            render(
                <MemoryRouter
                    initialEntries={[
                        RouteCreator.inProgressTickets("123", "456"),
                    ]}
                >
                    <TicketForBoard
                        key={"1"}
                        isFirstTicket={false}
                        ticket={{
                            shortenedItemId: "",
                            title: "Ticket Name",
                            summary: "Ticket Summary",
                            sections: [],
                            ticketTemplateShortenedItemId: "",
                            createdTimestamp: "",
                            lastModifiedTimestamp: "",
                            completedTimestamp: "",
                            columnId: "",
                            directAccessTicketId: "",
                            pointValueFromTags: Infinity,
                            itemId: "",
                            belongsTo: "",
                        }}
                        onDeleteTicket={() => null}
                        showCompletedDate
                        ticketType={TicketType.InProgress}
                        columnOptions={[]}
                        onUpdateTicketColumn={() => null}
                        onMoveTicketToBacklog={() => null}
                    />
                </MemoryRouter>
            );

            screen.queryByTestId("Priority Score: MAX");
        });
    });

    describe("the priority score is a valid number", () => {
        it("should display the priority score", () => {
            render(
                <MemoryRouter
                    initialEntries={[
                        RouteCreator.inProgressTickets("123", "456"),
                    ]}
                >
                    <TicketForBoard
                        key={"1"}
                        isFirstTicket={false}
                        ticket={{
                            shortenedItemId: "",
                            title: "Ticket Name",
                            summary: "Ticket Summary",
                            sections: [],
                            ticketTemplateShortenedItemId: "",
                            createdTimestamp: "",
                            lastModifiedTimestamp: "",
                            completedTimestamp: "",
                            columnId: "",
                            directAccessTicketId: "",
                            pointValueFromTags: 5,
                            itemId: "",
                            belongsTo: "",
                        }}
                        onDeleteTicket={() => null}
                        showCompletedDate
                        ticketType={TicketType.InProgress}
                        columnOptions={[]}
                        onUpdateTicketColumn={() => null}
                        onMoveTicketToBacklog={() => null}
                    />
                </MemoryRouter>
            );

            screen.queryByTestId("Priority Score: 5");
        });
    });
});
