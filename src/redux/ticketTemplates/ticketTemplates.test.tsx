import { cloneDeep, isEqual } from "lodash";
import weightedTicketTemplateCreationReducer, {
    createTicketTemplateId,
    deleteWeightedTicketTemplateCreationSection,
    initialTicketTemplateControlStateMapping,
    insertWeightedTicketCreationSection,
    ITicketTemplateControlState,
    ITicketTemplateNumberSectionControlState,
    ITicketTemplateTextSectionControlState,
    overrideWeightedTicketCreationSection,
    resetWeightedTicketTemplateCreationState,
    setWeightedTicketTemplate,
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
    setWeightedTicketTemplates,
    ticketTemplatesControlStateErrors,
    updatePriorityWeightingCalculation,
    updateWeightedTicketTemplateCreationDescription,
    updateWeightedTicketTemplateCreationName,
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

    describe("updateWeightedTicketTemplateCreationName", () => {
        let ticketTemplateControlState: ITicketTemplateControlState;

        describe("the name is an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationName({
                    name: "",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return the name error", () => {
                expect(ticketTemplateControlState.name.error).toBe(
                    ticketTemplatesControlStateErrors.name
                );
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.name.touched).toBe(true);
            });

            it("should return the correct name value", () => {
                expect(ticketTemplateControlState.name.value).toBe("");
            });
        });

        describe("the name is NOT an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationName({
                    name: "A",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return an empty string for the name error", () => {
                expect(ticketTemplateControlState.name.error).toBe("");
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.name.touched).toBe(true);
            });

            it("should return the correct name value", () => {
                expect(ticketTemplateControlState.name.value).toBe("A");
            });
        });
    });

    describe("updateWeightedTicketTemplateCreationDescription", () => {
        let ticketTemplateControlState: ITicketTemplateControlState;

        describe("the description is an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationDescription({
                    description: "",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return the description error", () => {
                expect(ticketTemplateControlState.description.error).toBe(
                    ticketTemplatesControlStateErrors.description
                );
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.description.touched).toBe(
                    true
                );
            });

            it("should return the correct description value", () => {
                expect(ticketTemplateControlState.description.value).toBe("");
            });
        });

        describe("the description is NOT an empty string", () => {
            beforeEach(() => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                const action = updateWeightedTicketTemplateCreationDescription({
                    description: "A",
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
            });

            it("should return an empty string for the description error", () => {
                expect(ticketTemplateControlState.description.error).toBe("");
            });

            it("should set touched to true", () => {
                expect(ticketTemplateControlState.description.touched).toBe(
                    true
                );
            });

            it("should return the correct description value", () => {
                expect(ticketTemplateControlState.description.value).toBe("A");
            });
        });
    });

    describe("overrideWeightedTicketCreationSection", () => {
        let ticketTemplateControlState: ITicketTemplateControlState;

        describe("text section", () => {
            let textSection: ITextSection;
            beforeEach(() => {
                textSection = {
                    type: "text",
                    label: "",
                    multiline: false,
                    required: false,
                };
            });

            describe("the label is an empty string", () => {
                beforeEach(() => {
                    const clonedInitialState = cloneDeep(
                        initialTicketTemplateControlStateMapping
                    );

                    const action = overrideWeightedTicketCreationSection({
                        value: textSection,
                        index: 0,
                        ticketTemplateId: createTicketTemplateId,
                    });
                    const state = weightedTicketTemplateCreationReducer(
                        clonedInitialState,
                        action
                    );
                    ticketTemplateControlState = state[createTicketTemplateId];
                });

                it("should return an error for the text section", () => {
                    expect(
                        (ticketTemplateControlState
                            .sections[0] as ITicketTemplateTextSectionControlState)
                            .error
                    ).toBe(ticketTemplatesControlStateErrors.generic);
                });

                it("should update the value", () => {
                    const controlValue = (ticketTemplateControlState
                        .sections[0] as ITicketTemplateTextSectionControlState)
                        .value;
                    expect(isEqual(controlValue, textSection)).toBe(true);
                });
            });

            describe("the label is NOT empty string", () => {
                beforeEach(() => {
                    const clonedInitialState = cloneDeep(
                        initialTicketTemplateControlStateMapping
                    );

                    textSection.label = "A";
                    const action = overrideWeightedTicketCreationSection({
                        value: textSection,
                        index: 0,
                        ticketTemplateId: createTicketTemplateId,
                    });
                    const state = weightedTicketTemplateCreationReducer(
                        clonedInitialState,
                        action
                    );
                    ticketTemplateControlState = state[createTicketTemplateId];
                });

                it("should return an empty error string for the text section", () => {
                    expect(
                        (ticketTemplateControlState
                            .sections[0] as ITicketTemplateTextSectionControlState)
                            .error
                    ).toBe("");
                });

                it("should update the value", () => {
                    const controlValue = (ticketTemplateControlState
                        .sections[0] as ITicketTemplateTextSectionControlState)
                        .value;
                    expect(isEqual(controlValue, textSection)).toBe(true);
                });
            });
        });

        describe("number section", () => {
            let numberSection: INumberSection;
            beforeEach(() => {
                numberSection = {
                    type: "number",
                    label: "Label",
                    required: false,
                    allowOnlyIntegers: false,
                    alias: "",
                };
            });

            describe("the label is an empty string", () => {
                beforeEach(() => {
                    numberSection.label = "";
                    const clonedInitialState = cloneDeep(
                        initialTicketTemplateControlStateMapping
                    );

                    const action = overrideWeightedTicketCreationSection({
                        value: numberSection,
                        index: 1,
                        ticketTemplateId: createTicketTemplateId,
                    });
                    const state = weightedTicketTemplateCreationReducer(
                        clonedInitialState,
                        action
                    );
                    ticketTemplateControlState = state[createTicketTemplateId];
                });

                it("should return an error for the number section", () => {
                    expect(
                        (ticketTemplateControlState
                            .sections[1] as ITicketTemplateNumberSectionControlState)
                            .labelError
                    ).toBe(ticketTemplatesControlStateErrors.generic);
                });

                it("should update the value", () => {
                    const controlValue = (ticketTemplateControlState
                        .sections[1] as ITicketTemplateNumberSectionControlState)
                        .value;
                    expect(isEqual(controlValue, numberSection)).toBe(true);
                });
            });

            describe("the label is NOT empty string", () => {
                beforeEach(() => {
                    const clonedInitialState = cloneDeep(
                        initialTicketTemplateControlStateMapping
                    );

                    numberSection.label = "A";
                    const action = overrideWeightedTicketCreationSection({
                        value: numberSection,
                        index: 1,
                        ticketTemplateId: createTicketTemplateId,
                    });
                    const state = weightedTicketTemplateCreationReducer(
                        clonedInitialState,
                        action
                    );
                    ticketTemplateControlState = state[createTicketTemplateId];
                });

                it("should return an empty error string for the number section", () => {
                    expect(
                        (ticketTemplateControlState
                            .sections[1] as ITicketTemplateNumberSectionControlState)
                            .labelError
                    ).toBe("");
                });

                it("should update the value", () => {
                    const controlValue = (ticketTemplateControlState
                        .sections[1] as ITicketTemplateNumberSectionControlState)
                        .value;
                    expect(isEqual(controlValue, numberSection)).toBe(true);
                });
            });

            describe("the min is greater than the max", () => {
                it("should return a min error", () => {
                    const clonedInitialState = cloneDeep(
                        initialTicketTemplateControlStateMapping
                    );

                    numberSection.maxValue = 1;
                    numberSection.minValue = 2;
                    const action = overrideWeightedTicketCreationSection({
                        value: numberSection,
                        index: 1,
                        ticketTemplateId: createTicketTemplateId,
                    });
                    const state = weightedTicketTemplateCreationReducer(
                        clonedInitialState,
                        action
                    );
                    ticketTemplateControlState = state[createTicketTemplateId];
                    expect(
                        (ticketTemplateControlState
                            .sections[1] as ITicketTemplateNumberSectionControlState)
                            .minError
                    ).toBe(ticketTemplatesControlStateErrors.minError);
                });
            });

            describe("the max is greater than the min", () => {
                it("should return a max error", () => {
                    const clonedInitialState = cloneDeep(
                        initialTicketTemplateControlStateMapping
                    );

                    numberSection.maxValue = 1;
                    numberSection.minValue = 2;
                    const action = overrideWeightedTicketCreationSection({
                        value: numberSection,
                        index: 1,
                        ticketTemplateId: createTicketTemplateId,
                    });
                    const state = weightedTicketTemplateCreationReducer(
                        clonedInitialState,
                        action
                    );
                    ticketTemplateControlState = state[createTicketTemplateId];
                    expect(
                        (ticketTemplateControlState
                            .sections[1] as ITicketTemplateNumberSectionControlState)
                            .maxError
                    ).toBe(ticketTemplatesControlStateErrors.maxError);
                });
            });

            describe("the alias is an invalid string", () => {
                it("should return an alias error", () => {
                    const clonedInitialState = cloneDeep(
                        initialTicketTemplateControlStateMapping
                    );

                    numberSection.alias = "Invalid alias";
                    const action = overrideWeightedTicketCreationSection({
                        value: numberSection,
                        index: 1,
                        ticketTemplateId: createTicketTemplateId,
                    });
                    const state = weightedTicketTemplateCreationReducer(
                        clonedInitialState,
                        action
                    );
                    ticketTemplateControlState = state[createTicketTemplateId];
                    expect(
                        (ticketTemplateControlState
                            .sections[1] as ITicketTemplateNumberSectionControlState)
                            .aliasError
                    ).toBe(ticketTemplatesControlStateErrors.aliasError);
                });
            });
        });
    });

    describe("insertWeightedTicketCreationSection", () => {
        let ticketTemplateControlState: ITicketTemplateControlState;
        let numberSection: INumberSection;
        beforeEach(() => {
            numberSection = {
                type: "number",
                label: "Label",
                required: false,
                allowOnlyIntegers: false,
                alias: "",
            };
        });

        // most of this is already covered in the overrideWeightedTicketCreationSection action tests
        // so I'm just writing a test to ensure a new section is added in the correct spots

        describe("the index is -1", () => {
            it("should add the new section to the beginning of the sections list", () => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                clonedInitialState[createTicketTemplateId].sections = [
                    {
                        value: cloneDeep(numberSection),
                        labelError: "",
                        minError: "",
                        maxError: "",
                        aliasError: "",
                    },
                ];

                numberSection.label = "Added Section Label";

                const action = insertWeightedTicketCreationSection({
                    value: numberSection,
                    index: -1,
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
                expect(ticketTemplateControlState.sections.length).toBe(2);
                expect(
                    (ticketTemplateControlState
                        .sections[0] as ITicketTemplateNumberSectionControlState)
                        .value.label
                ).toBe("Added Section Label");
            });
        });

        describe("the index is not -1", () => {
            it("should add the new section to the correct location of the sections list", () => {
                const clonedInitialState = cloneDeep(
                    initialTicketTemplateControlStateMapping
                );
                clonedInitialState[createTicketTemplateId].sections = [
                    {
                        value: cloneDeep(numberSection),
                        labelError: "",
                        minError: "",
                        maxError: "",
                        aliasError: "",
                    },
                ];

                numberSection.label = "Added Section Label";

                const action = insertWeightedTicketCreationSection({
                    value: numberSection,
                    index: 0,
                    ticketTemplateId: createTicketTemplateId,
                });
                const state = weightedTicketTemplateCreationReducer(
                    clonedInitialState,
                    action
                );
                ticketTemplateControlState = state[createTicketTemplateId];
                expect(ticketTemplateControlState.sections.length).toBe(2);
                expect(
                    (ticketTemplateControlState
                        .sections[1] as ITicketTemplateNumberSectionControlState)
                        .value.label
                ).toBe("Added Section Label");
            });
        });
    });

    describe("deleteWeightedTicketTemplateCreationSection", () => {
        it("should remove the correct section", () => {
            const numberSection: INumberSection = {
                type: "number",
                label: "Label",
                required: false,
                allowOnlyIntegers: false,
                alias: "",
            };

            const clonedInitialState = cloneDeep(
                initialTicketTemplateControlStateMapping
            );
            clonedInitialState[createTicketTemplateId].sections = [
                {
                    value: numberSection,
                    labelError: "",
                    minError: "",
                    maxError: "",
                    aliasError: "",
                },
            ];

            const action = deleteWeightedTicketTemplateCreationSection({
                index: 0,
                ticketTemplateId: createTicketTemplateId,
            });
            const state = weightedTicketTemplateCreationReducer(
                clonedInitialState,
                action
            );
            const ticketTemplateControlState = state[createTicketTemplateId];
            expect(ticketTemplateControlState.sections.length).toBe(0);
        });
    });

    describe("updatePriorityWeightingCalculation", () => {
        it("should correctly set the value", () => {
            const clonedInitialState = cloneDeep(
                initialTicketTemplateControlStateMapping
            );

            const action = updatePriorityWeightingCalculation({
                priorityWeightingCalculation: "hello",
                ticketTemplateId: createTicketTemplateId,
            });

            const state = weightedTicketTemplateCreationReducer(
                clonedInitialState,
                action
            );

            const ticketTemplateControlState = state[createTicketTemplateId];
            expect(
                ticketTemplateControlState.priorityWeightingCalculation.value
            ).toBe("hello");
        });
    });
});
