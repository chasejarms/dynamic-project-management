import { cloneDeep, isEqual } from "lodash";
import ticketCreationReducer, {
    initialTicketCreationState,
    resetTicketCreation,
    ticketCreationDefaultRequiredError,
    updateTicketSummary,
    updateTicketTitle,
} from "./";

describe("Ticket Creation", () => {
    describe("Reset Ticket Creation", () => {
        it("should return the initial state", () => {
            const initialStateWithSmallChanges = cloneDeep({
                ...initialTicketCreationState,
                startingColumn: "hello",
                title: {
                    value: "Something",
                    touched: false,
                    error: "yeah this input is not gonna work",
                },
            });
            const resetTicketCreationAction = resetTicketCreation();
            const ticketCreationState = ticketCreationReducer(
                initialStateWithSmallChanges,
                resetTicketCreationAction
            );
            expect(
                isEqual(ticketCreationState, initialTicketCreationState)
            ).toBe(true);
        });
    });

    describe("Update Ticket Title", () => {
        describe("The title is an empty string", () => {
            it("should return the default required error", () => {
                const clonedInitialState = cloneDeep(
                    initialTicketCreationState
                );
                const updateTicketTitleAction = updateTicketTitle("");
                const ticketCreationState = ticketCreationReducer(
                    clonedInitialState,
                    updateTicketTitleAction
                );
                expect(ticketCreationState.title.error).toBe(
                    ticketCreationDefaultRequiredError
                );
            });
        });

        describe("The title is not an empty string", () => {
            it("should return an empty string for the error", () => {
                const clonedInitialState = cloneDeep(
                    initialTicketCreationState
                );
                const updateTicketTitleAction = updateTicketTitle("A");
                const ticketCreationState = ticketCreationReducer(
                    clonedInitialState,
                    updateTicketTitleAction
                );
                expect(ticketCreationState.title.error).toBe("");
            });
        });

        it("should return true for touched", () => {
            const clonedInitialState = cloneDeep(initialTicketCreationState);
            const updateTicketTitleAction = updateTicketTitle("A");
            const ticketCreationState = ticketCreationReducer(
                clonedInitialState,
                updateTicketTitleAction
            );
            expect(ticketCreationState.title.touched).toBe(true);
        });
    });

    describe("Update Ticket Summary", () => {
        describe("The summary is an empty string", () => {
            it("should return the default required error", () => {
                const clonedInitialState = cloneDeep(
                    initialTicketCreationState
                );
                const updateTicketSummaryAction = updateTicketSummary("");
                const ticketCreationState = ticketCreationReducer(
                    clonedInitialState,
                    updateTicketSummaryAction
                );
                expect(ticketCreationState.summary.error).toBe(
                    ticketCreationDefaultRequiredError
                );
            });
        });

        describe("The summary is not an empty string", () => {
            it("should return an empty string for the error", () => {
                const clonedInitialState = cloneDeep(
                    initialTicketCreationState
                );
                const updateTicketSummaryAction = updateTicketSummary("A");
                const ticketCreationState = ticketCreationReducer(
                    clonedInitialState,
                    updateTicketSummaryAction
                );
                expect(ticketCreationState.summary.error).toBe("");
            });
        });

        it("should return true for touched", () => {
            const clonedInitialState = cloneDeep(initialTicketCreationState);
            const updateTicketSummaryAction = updateTicketSummary("A");
            const ticketCreationState = ticketCreationReducer(
                clonedInitialState,
                updateTicketSummaryAction
            );
            expect(ticketCreationState.summary.touched).toBe(true);
        });
    });
});
