import { cloneDeep, isEqual } from "lodash";
import ticketControlMappedStateReducer, {
    initialTicketControlMappedState,
    setInitialTicketData,
    ticketPreviewId,
    ticketControlMappedStateRequiredError,
    updateTicketSummary,
    updateTicketTitle,
    ITicketControlMappedState,
    updateSectionValue,
    ticketTitleError,
} from ".";
import {
    numberValidatorIntegerError,
    numberValidatorMaxError,
    numberValidatorMinError,
} from "../../classes/NumberValidator";

describe("Ticket Control Mapped State", () => {
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
            ).toBe(ticketControlMappedStateRequiredError);
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

    describe("updateTicketSummary action", () => {
        it("should update the ticket summary", () => {
            const updateTicketSummaryAction = updateTicketSummary({
                value: "hello",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketSummaryAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.summary.value
            ).toBe("hello");
        });

        it("should set touched to true", () => {
            const updateTicketSummaryAction = updateTicketSummary({
                value: "hello",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketSummaryAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.summary.touched
            ).toBe(true);
        });

        it("should return the default error if a summary is not provided", () => {
            const updateTicketSummaryAction = updateTicketSummary({
                value: "",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketSummaryAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.summary.error
            ).toBe(ticketControlMappedStateRequiredError);
        });

        it("should return an empty string for the error if the summary is provided", () => {
            const updateTicketSummaryAction = updateTicketSummary({
                value: "A",
                ticketId: ticketPreviewId,
            });
            const ticketControlMappedState = ticketControlMappedStateReducer(
                undefined,
                updateTicketSummaryAction
            );
            expect(
                ticketControlMappedState[ticketPreviewId].ticket.summary.error
            ).toBe("");
        });
    });

    describe("updateSectionValue action", () => {
        describe("text section update", () => {
            let beforeTicketControlMappedState: ITicketControlMappedState;

            beforeEach(() => {
                beforeTicketControlMappedState = cloneDeep(
                    initialTicketControlMappedState
                );
                const {
                    ticket,
                    ticketTemplate,
                } = beforeTicketControlMappedState[ticketPreviewId];
                ticket.sections = [
                    {
                        value: "",
                        touched: false,
                        error: "",
                    },
                ];
                ticketTemplate.sections = [
                    {
                        type: "text",
                        label: "Label",
                        multiline: true,
                        required: false,
                    },
                ];
            });

            it("should mark the control as touched", () => {
                const updateSectionValueAction = updateSectionValue({
                    index: 0,
                    value: "hello",
                    ticketId: ticketPreviewId,
                });
                const ticketControlMappedState = ticketControlMappedStateReducer(
                    beforeTicketControlMappedState,
                    updateSectionValueAction
                );
                expect(
                    ticketControlMappedState[ticketPreviewId].ticket.sections[0]
                        .touched
                ).toBe(true);
            });

            it("should replace the value with the incoming value", () => {
                const updateSectionValueAction = updateSectionValue({
                    index: 0,
                    value: "hello",
                    ticketId: ticketPreviewId,
                });
                const ticketControlMappedState = ticketControlMappedStateReducer(
                    beforeTicketControlMappedState,
                    updateSectionValueAction
                );
                expect(
                    ticketControlMappedState[ticketPreviewId].ticket.sections[0]
                        .value
                ).toBe("hello");
            });

            describe("the ticket template requires a section value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "text",
                            label: "Label",
                            multiline: true,
                            required: true,
                        },
                    ];
                });

                describe("the value is an empty string", () => {
                    it("should return the required error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: "",
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe(ticketControlMappedStateRequiredError);
                    });
                });

                describe("the value is not an empty string", () => {
                    it("should return an empty string from the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: "A",
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });
            });

            describe("The ticket template DOES NOT require a section value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "text",
                            label: "Label",
                            multiline: true,
                            required: false,
                        },
                    ];
                });

                describe("the value is an empty string", () => {
                    it("should return an empty string from the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: "",
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });

                describe("the value IS NOT an empty string", () => {
                    it("should return an empty string from the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: "A",
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });
            });
        });

        describe("number section update", () => {
            let beforeTicketControlMappedState: ITicketControlMappedState;

            beforeEach(() => {
                beforeTicketControlMappedState = cloneDeep(
                    initialTicketControlMappedState
                );
                const {
                    ticket,
                    ticketTemplate,
                } = beforeTicketControlMappedState[ticketPreviewId];
                ticket.sections = [
                    {
                        value: "",
                        touched: false,
                        error: "",
                    },
                ];
                ticketTemplate.sections = [
                    {
                        type: "number",
                        label: "Label",
                        required: false,
                        allowOnlyIntegers: false,
                        alias: "",
                    },
                ];
            });

            it("should mark the control as touched", () => {
                const updateSectionValueAction = updateSectionValue({
                    index: 0,
                    value: 2,
                    ticketId: ticketPreviewId,
                });
                const ticketControlMappedState = ticketControlMappedStateReducer(
                    beforeTicketControlMappedState,
                    updateSectionValueAction
                );
                expect(
                    ticketControlMappedState[ticketPreviewId].ticket.sections[0]
                        .touched
                ).toBe(true);
            });

            it("should replace the existing value with the incoming value", () => {
                const updateSectionValueAction = updateSectionValue({
                    index: 0,
                    value: 2,
                    ticketId: ticketPreviewId,
                });
                const ticketControlMappedState = ticketControlMappedStateReducer(
                    beforeTicketControlMappedState,
                    updateSectionValueAction
                );
                expect(
                    ticketControlMappedState[ticketPreviewId].ticket.sections[0]
                        .value
                ).toBe(2);
            });

            describe("The ticket template requires a section value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: true,
                            allowOnlyIntegers: false,
                            alias: "",
                        },
                    ];
                });

                describe("A value is provided", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 2,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });

                describe("A value IS NOT provided", () => {
                    it("should return the required error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: "",
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe(ticketControlMappedStateRequiredError);
                    });
                });
            });

            describe("The ticket template DOES NOT required a section value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: false,
                            allowOnlyIntegers: false,
                            alias: "",
                        },
                    ];
                });

                describe("A value is provided", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 2,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });

                describe("A value IS NOT provided", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: "",
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });
            });

            describe("The ticket template expects an integer", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: false,
                            allowOnlyIntegers: true,
                            alias: "",
                        },
                    ];
                });

                describe("The value is an integer", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 1,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });

                describe("The value IS NOT an integer", () => {
                    it("should return the default integer error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 1.1,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe(numberValidatorIntegerError);
                    });
                });
            });

            describe("The ticket template DOES NOT expect an integer", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: false,
                            allowOnlyIntegers: false,
                            alias: "",
                        },
                    ];
                });

                describe("The value is an integer", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 1,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });

                describe("The value IS NOT an integer", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 1.1,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });
            });

            describe("The ticket template has a max value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: false,
                            allowOnlyIntegers: false,
                            maxValue: 5,
                            alias: "",
                        },
                    ];
                });

                describe("The value is greater than the max value", () => {
                    it("should return the default max value error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 6,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe(numberValidatorMaxError);
                    });
                });

                describe("The value is less than the max value", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 4,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });

                describe("The value is equal to the max value", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 5,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });
            });

            describe("The ticket template DOES NOT have a max value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: false,
                            allowOnlyIntegers: false,
                            alias: "",
                        },
                    ];
                });

                it("should return an empty string for the error", () => {
                    const updateSectionValueAction = updateSectionValue({
                        index: 0,
                        value: 10000000,
                        ticketId: ticketPreviewId,
                    });
                    const ticketControlMappedState = ticketControlMappedStateReducer(
                        beforeTicketControlMappedState,
                        updateSectionValueAction
                    );
                    expect(
                        ticketControlMappedState[ticketPreviewId].ticket
                            .sections[0].error
                    ).toBe("");
                });
            });

            describe("The ticket template has a min value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: false,
                            allowOnlyIntegers: false,
                            minValue: 5,
                            alias: "",
                        },
                    ];
                });

                describe("The value is greater than the min value", () => {
                    it("should return an empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 6,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });

                describe("The value is less than the min value", () => {
                    it("should return the default min value error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 4,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe(numberValidatorMinError);
                    });
                });

                describe("The value is equal to the min value", () => {
                    it("should return am empty string for the error", () => {
                        const updateSectionValueAction = updateSectionValue({
                            index: 0,
                            value: 5,
                            ticketId: ticketPreviewId,
                        });
                        const ticketControlMappedState = ticketControlMappedStateReducer(
                            beforeTicketControlMappedState,
                            updateSectionValueAction
                        );
                        expect(
                            ticketControlMappedState[ticketPreviewId].ticket
                                .sections[0].error
                        ).toBe("");
                    });
                });
            });

            describe("The ticket template DOES NOT have a min value", () => {
                beforeEach(() => {
                    beforeTicketControlMappedState[
                        ticketPreviewId
                    ].ticketTemplate.sections = [
                        {
                            type: "number",
                            label: "Label",
                            required: false,
                            allowOnlyIntegers: false,
                            alias: "",
                        },
                    ];
                });

                it("should return am empty string for the error", () => {
                    const updateSectionValueAction = updateSectionValue({
                        index: 0,
                        value: -1000000,
                        ticketId: ticketPreviewId,
                    });
                    const ticketControlMappedState = ticketControlMappedStateReducer(
                        beforeTicketControlMappedState,
                        updateSectionValueAction
                    );
                    expect(
                        ticketControlMappedState[ticketPreviewId].ticket
                            .sections[0].error
                    ).toBe("");
                });
            });
        });
    });
});

describe("ticketTitleError", () => {
    describe("the title is an empty string", () => {
        it("should return the default required error", () => {
            const error = ticketTitleError("");
            expect(error).toBe(ticketControlMappedStateRequiredError);
        });
    });

    describe("the title IS NOT an empty string", () => {
        it("should return an empty string for the error", () => {
            const error = ticketTitleError("A");
            expect(error).toBe("");
        });
    });
});
