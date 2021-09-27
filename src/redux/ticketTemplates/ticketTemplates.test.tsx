import { cloneDeep, isEqual } from "lodash";
import weightedTicketTemplateCreationReducer, {
    createTicketTemplateId,
    initialTicketTemplateControlStateMapping,
    resetWeightedTicketTemplateCreationState,
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
} from ".";

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
});
