import { cloneDeep, isEqual } from "lodash";
import weightedTicketTemplateCreationReducer, {
    createTicketTemplateId,
    initialTicketTemplateControlStateMapping,
    ITicketTemplateControlState,
    ITicketTemplateNumberSectionControlState,
    ITicketTemplateTextSectionControlState,
    resetWeightedTicketTemplateCreationState,
    setWeightedTicketTemplate,
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
    setWeightedTicketTemplates,
    ticketTemplatesControlStateErrors,
    updateWeightedTicketTemplateCreationSummary,
    updateWeightedTicketTemplateCreationTitle,
} from ".";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { INumberSection } from "../../models/ticketTemplate/section/numberSection";
import { ITextSection } from "../../models/ticketTemplate/section/textSection";

describe("Ticket Templates", () => {
    describe("resetWeightedTicketTemplateCreationState", () => {
        it("should reset the state", () => {
            const initialStateWithSmallChange = cloneDeep(
                initialTicketTemplateControlStateMapping
            );
            initialStateWithSmallChange[createTicketTemplateId].name.error =
                "Some Error";
            const resetWeightedTicketTemplateCreationStateAction = resetWeightedTicketTemplateCreationState();
            const state = weightedTicketTemplateCreationReducer(
                initialStateWithSmallChange,
                resetWeightedTicketTemplateCreationStateAction
            );
            expect(
                isEqual(state, initialTicketTemplateControlStateMapping)
            ).toBe(true);
        });
    });

    describe("setWeightedTicketTemplateCreationFromExistingTicketTemplate", () => {
        it("should return the correct state", () => {
            const initialStateWithSmallChange = cloneDeep(
                initialTicketTemplateControlStateMapping
            );
            const ticketTemplateControlState =
                initialStateWithSmallChange[createTicketTemplateId];
            const clonedCreateTicketState = cloneDeep(
                ticketTemplateControlState
            );
            clonedCreateTicketState.description.value =
                "A New Description Label";
            clonedCreateTicketState.name.value = "Name";
            initialStateWithSmallChange["123"] = clonedCreateTicketState;

            const action = setWeightedTicketTemplateCreationFromExistingTicketTemplate(
                {
                    ticketTemplateId: "123",
                }
            );
            const state = weightedTicketTemplateCreationReducer(
                initialStateWithSmallChange,
                action
            );

            const createTicketTemplateState = state[createTicketTemplateId];
            expect(createTicketTemplateState.description.value).toBe(
                "A New Description Label"
            );
            expect(createTicketTemplateState.name.value).toBe("Name (Copy)");
        });
    });

    describe("setWeightedTicketTemplate", () => {
        it("should return the correct state", () => {
            const clonedInitialState = cloneDeep(
                initialTicketTemplateControlStateMapping
            );

            const textSection: ITextSection = {
                type: "text",
                label: "Text Label",
                multiline: false,
                required: false,
            };

            const numberSection: INumberSection = {
                type: "number",
                label: "Number Label",
                required: false,
                allowOnlyIntegers: false,
                alias: "",
            };

            const ticketTemplate: ITicketTemplate = {
                itemId: "",
                belongsTo: "",
                shortenedItemId: "123",
                name: "Feature Template",
                description: "Feature Description",
                title: {
                    label: "Title",
                },
                summary: {
                    label: "Summary",
                },
                sections: [textSection, numberSection],
                priorityWeightingCalculation: "",
            };
            const setWeightedTicketTemplateAction = setWeightedTicketTemplate({
                ticketTemplate,
                ticketTemplateId: "123",
            });
            const state = weightedTicketTemplateCreationReducer(
                clonedInitialState,
                setWeightedTicketTemplateAction
            );

            const {
                name,
                description,
                title,
                summary,
                sections: [
                    ticketTemplateTextSectionControlState,
                    ticketTemplateNumberSectionControlState,
                ],
                priorityWeightingCalculation,
            } = state["123"];

            expect(name.value).toBe("Feature Template");
            expect(name.touched).toBe(false);
            expect(name.error).toBe("");

            expect(description.value).toBe("Feature Description");
            expect(description.touched).toBe(false);
            expect(description.error).toBe("");

            expect(title.value).toBe("Title");
            expect(title.touched).toBe(false);
            expect(title.error).toBe("");

            expect(summary.value).toBe("Summary");
            expect(summary.touched).toBe(false);
            expect(summary.error).toBe("");

            const typedTextSection = ticketTemplateTextSectionControlState as ITicketTemplateTextSectionControlState;
            expect(typedTextSection.error).toBe("");
            expect(isEqual(typedTextSection.value, textSection)).toBe(true);

            const typedNumberSection = ticketTemplateNumberSectionControlState as ITicketTemplateNumberSectionControlState;
            expect(typedNumberSection.aliasError).toBe("");
            expect(typedNumberSection.labelError).toBe("");
            expect(typedNumberSection.maxError).toBe("");
            expect(typedNumberSection.minError).toBe("");
            expect(typedNumberSection.value).toBe(numberSection);

            expect(priorityWeightingCalculation.value).toBe("");
            expect(priorityWeightingCalculation.error).toBe("");
        });
    });

    describe("setWeightedTicketTemplates", () => {
        it("should return the correct state", () => {
            const clonedInitialState = cloneDeep(
                initialTicketTemplateControlStateMapping
            );

            const textSection: ITextSection = {
                type: "text",
                label: "Text Label",
                multiline: false,
                required: false,
            };

            const numberSection: INumberSection = {
                type: "number",
                label: "Number Label",
                required: false,
                allowOnlyIntegers: false,
                alias: "",
            };

            const ticketTemplateOne: ITicketTemplate = {
                itemId: "",
                belongsTo: "",
                shortenedItemId: "123",
                name: "Feature Template",
                description: "Feature Description",
                title: {
                    label: "Title",
                },
                summary: {
                    label: "Summary",
                },
                sections: [textSection, numberSection],
                priorityWeightingCalculation: "",
            };

            const ticketTemplateTwo: ITicketTemplate = {
                itemId: "",
                belongsTo: "",
                shortenedItemId: "234",
                name: "Feature Template",
                description: "Feature Description",
                title: {
                    label: "Title",
                },
                summary: {
                    label: "Summary",
                },
                sections: [textSection, numberSection],
                priorityWeightingCalculation: "",
            };

            const setWeightedTicketTemplatesAction = setWeightedTicketTemplates(
                [ticketTemplateOne, ticketTemplateTwo]
            );
            const state = weightedTicketTemplateCreationReducer(
                clonedInitialState,
                setWeightedTicketTemplatesAction
            );

            const {
                name,
                description,
                title,
                summary,
                sections: [
                    ticketTemplateTextSectionControlState,
                    ticketTemplateNumberSectionControlState,
                ],
                priorityWeightingCalculation,
            } = state["123"];

            expect(name.value).toBe("Feature Template");
            expect(name.touched).toBe(false);
            expect(name.error).toBe("");

            expect(description.value).toBe("Feature Description");
            expect(description.touched).toBe(false);
            expect(description.error).toBe("");

            expect(title.value).toBe("Title");
            expect(title.touched).toBe(false);
            expect(title.error).toBe("");

            expect(summary.value).toBe("Summary");
            expect(summary.touched).toBe(false);
            expect(summary.error).toBe("");

            const typedTextSection = ticketTemplateTextSectionControlState as ITicketTemplateTextSectionControlState;
            expect(typedTextSection.error).toBe("");
            expect(isEqual(typedTextSection.value, textSection)).toBe(true);

            const typedNumberSection = ticketTemplateNumberSectionControlState as ITicketTemplateNumberSectionControlState;
            expect(typedNumberSection.aliasError).toBe("");
            expect(typedNumberSection.labelError).toBe("");
            expect(typedNumberSection.maxError).toBe("");
            expect(typedNumberSection.minError).toBe("");
            expect(typedNumberSection.value).toBe(numberSection);

            expect(priorityWeightingCalculation.value).toBe("");
            expect(priorityWeightingCalculation.error).toBe("");

            const {
                name: nameTwo,
                description: descriptionTwo,
                title: titleTwo,
                summary: summaryTwo,
                sections: [
                    ticketTemplateTwoTextSectionControlState,
                    ticketTemplateTwoNumberSectionControlState,
                ],
                priorityWeightingCalculation: priorityWeightingCalculationTwo,
            } = state["123"];

            expect(nameTwo.value).toBe("Feature Template");
            expect(nameTwo.touched).toBe(false);
            expect(nameTwo.error).toBe("");

            expect(descriptionTwo.value).toBe("Feature Description");
            expect(descriptionTwo.touched).toBe(false);
            expect(descriptionTwo.error).toBe("");

            expect(titleTwo.value).toBe("Title");
            expect(titleTwo.touched).toBe(false);
            expect(titleTwo.error).toBe("");

            expect(summaryTwo.value).toBe("Summary");
            expect(summaryTwo.touched).toBe(false);
            expect(summaryTwo.error).toBe("");

            const typedTextSectionTwo = ticketTemplateTwoTextSectionControlState as ITicketTemplateTextSectionControlState;
            expect(typedTextSectionTwo.error).toBe("");
            expect(isEqual(typedTextSectionTwo.value, textSection)).toBe(true);

            const typedNumberSectionTwo = ticketTemplateTwoNumberSectionControlState as ITicketTemplateNumberSectionControlState;
            expect(typedNumberSectionTwo.aliasError).toBe("");
            expect(typedNumberSectionTwo.labelError).toBe("");
            expect(typedNumberSectionTwo.maxError).toBe("");
            expect(typedNumberSectionTwo.minError).toBe("");
            expect(typedNumberSectionTwo.value).toBe(numberSection);

            expect(priorityWeightingCalculationTwo.value).toBe("");
            expect(priorityWeightingCalculationTwo.error).toBe("");
        });
    });

    describe("updateWeightedTicketTemplateCreationTitle", () => {
        let ticketTemplateControlState: ITicketTemplateControlState;

        describe("the title is an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationTitle({
                    title: "",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return the title error", () => {
                expect(ticketTemplateControlState.title.error).toBe(
                    ticketTemplatesControlStateErrors.title
                );
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.title.touched).toBe(true);
            });

            it("should return the correct title value", () => {
                expect(ticketTemplateControlState.title.value).toBe("");
            });
        });

        describe("the title is NOT an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationTitle({
                    title: "A",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return an empty string for the title error", () => {
                expect(ticketTemplateControlState.title.error).toBe("");
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.title.touched).toBe(true);
            });

            it("should return the correct title value", () => {
                expect(ticketTemplateControlState.title.value).toBe("A");
            });
        });
    });

    describe("updateWeightedTicketTemplateCreationSummary", () => {
        let ticketTemplateControlState: ITicketTemplateControlState;

        describe("the summary is an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationSummary({
                    summary: "",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return the summary error", () => {
                expect(ticketTemplateControlState.summary.error).toBe(
                    ticketTemplatesControlStateErrors.summary
                );
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.summary.touched).toBe(true);
            });

            it("should return the correct summary value", () => {
                expect(ticketTemplateControlState.summary.value).toBe("");
            });
        });

        describe("the summary is NOT an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationSummary({
                    summary: "A",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return an empty string for the summary error", () => {
                expect(ticketTemplateControlState.summary.error).toBe("");
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.summary.touched).toBe(true);
            });

            it("should return the correct summary value", () => {
                expect(ticketTemplateControlState.summary.value).toBe("A");
            });
        });
    });
});
