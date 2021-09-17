import { cloneDeep, isEqual } from "lodash";
import ticketControlMappedStateReducer, {
    initialTicketControlMappedState,
    setInitialTicketData,
    ticketPreviewId,
    ticketSummaryAndTitleRequiredError,
    updateTicketTitle,
} from ".";

describe("Ticket", () => {
    it("should have ticket control state for the ticket preview id by default", () => {
        const ticketControlMappedState = ticketControlMappedStateReducer(
            undefined,
            {
                type: "Unused",
            }
        );
        expect(ticketControlMappedState[ticketPreviewId]).toBeTruthy();
    });

    describe("setInitialTicketData action", () => {
        it("should set the initial ticket data", () => {
            const clonedTicketPreviewIdState = cloneDeep(
                initialTicketControlMappedState
            )[ticketPreviewId];
            const setInitialTicketDataAction = setInitialTicketData({
                ticketId: "123",
                ticket: clonedTicketPreviewIdState.ticket,
                ticketTemplate: clonedTicketPreviewIdState.ticketTemplate,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                setInitialTicketDataAction
            );
            expect(
                isEqual(ticketControlMappedState["123"], {
                    ticket: clonedTicketPreviewIdState.ticket,
                    ticketTemplate: clonedTicketPreviewIdState.ticketTemplate,
                })
            ).toBe(true);
        });
    });

    describe("updateTicketTitle action", () => {
        it("should update the ticket title", () => {
            const updateTicketTitleAction = updateTicketTitle({
                value: "hello",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketTitleAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.title.value
            ).toBe("hello");
        });

        it("should set touched to true", () => {
            const updateTicketTitleAction = updateTicketTitle({
                value: "hello",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketTitleAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.title.touched
            ).toBe(true);
        });

        it("should return the default error if a title is not provided", () => {
            const updateTicketTitleAction = updateTicketTitle({
                value: "",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketTitleAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.title.error
            ).toBe(ticketSummaryAndTitleRequiredError);
        });

        it("should return an empty string for the error if the title is provided", () => {
            const updateTicketTitleAction = updateTicketTitle({
                value: "A",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketTitleAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.title.error
            ).toBe("");
        });
    });
});
