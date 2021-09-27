import { cloneDeep, isEqual } from "lodash";
import weightedTicketTemplateCreationReducer, {
    createTicketTemplateId,
    initialTicketTemplateControlStateMapping,
    ITicketTemplateNumberSectionControlState,
    ITicketTemplateTextSectionControlState,
    resetWeightedTicketTemplateCreationState,
    setWeightedTicketTemplate,
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
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
});
