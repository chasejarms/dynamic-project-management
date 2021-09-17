import { cloneDeep, isEqual } from "lodash";
import ticketCreationReducer, {
    initialTicketCreationState,
    ITicketCreationState,
    resetTicketCreation,
    ticketCreationDefaultRequiredError,
    updateSection,
    updateStartingColumn,
    updateTicketSummary,
    updateTicketTemplate,
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

    describe("Update Ticket Template", () => {
        describe("The action payload is null", () => {
            it("should return null for the ticket template and an empty array for the sections", () => {
                const clonedInitialState: ITicketCreationState = cloneDeep({
                    ...initialTicketCreationState,
                    sections: [
                        {
                            value: "hello",
                        },
                    ],
                    ticketTemplate: {
                        sections: [],
                    } as any,
                });
                const updateTicketTemplateAction = updateTicketTemplate(null);
                const ticketCreationState = ticketCreationReducer(
                    clonedInitialState,
                    updateTicketTemplateAction
                );
                expect(ticketCreationState.ticketTemplate).toBeNull();
                expect(ticketCreationState.sections.length).toBe(0);
            });
        });

        describe("The action payload is a ticket template", () => {
            it("should return the ticket template and an empty string for each ticket template section", () => {
                const clonedInitialState: ITicketCreationState = cloneDeep(
                    initialTicketCreationState
                );
                const updateTicketTemplateAction = updateTicketTemplate({
                    sections: [
                        {
                            type: "text",
                            label: "label",
                            multiline: false,
                            required: true,
                        },
                    ],
                } as any);
                const ticketCreationState = ticketCreationReducer(
                    clonedInitialState,
                    updateTicketTemplateAction
                );
                expect(
                    ticketCreationState.ticketTemplate?.sections[0].label
                ).toBe("label");
                expect(ticketCreationState.sections.length).toBe(1);
            });
        });
    });

    describe("Update Section", () => {
        it("should override the existing section value with the updated section value", () => {
            const clonedInitialState = cloneDeep({
                ...initialTicketCreationState,
                sections: [
                    {
                        value: "hello",
                    },
                ],
            });
            const updateSectionAction = updateSection({
                value: "goodbye",
                index: 0,
            });
            const ticketCreationState = ticketCreationReducer(
                clonedInitialState,
                updateSectionAction
            );
            expect(ticketCreationState.sections[0].value).toBe("goodbye");
        });
    });

    describe("Update Starting Column", () => {
        it("should update the starting column value", () => {
            const clonedInitialState = cloneDeep({
                ...initialTicketCreationState,
                startingColumn: "abc",
            });
            const updateStartingColumnAction = updateStartingColumn("123");
            const ticketCreationState = ticketCreationReducer(
                clonedInitialState,
                updateStartingColumnAction
            );
            expect(ticketCreationState.startingColumn).toBe("123");
        });
    });
});
