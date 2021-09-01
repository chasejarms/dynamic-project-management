import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControlValidator } from "../../classes/ControlValidator";
import { cloneDeep } from "lodash";
import { IWeightedSection } from "../../models/weightedSections";

export interface IWeightedTicketTemplateCreationState {
    name: {
        value: string;
        touched: boolean;
        error: string;
    };
    description: {
        value: string;
        touched: boolean;
        error: string;
    };
    title: {
        value: string;
        touched: boolean;
        error: string;
    };
    summary: {
        value: string;
        touched: boolean;
        error: string;
    };
    type: {
        value: string;
        touched: boolean;
        error: string;
    };
    sections: {
        value: IWeightedSection;
        error: string;
    }[];
}

const defaultRequiredError = "This field is required";
const initialState: IWeightedTicketTemplateCreationState = {
    name: {
        value: "",
        touched: false,
        error: defaultRequiredError,
    },
    description: {
        value: "",
        touched: false,
        error: defaultRequiredError,
    },
    title: {
        value: "Title",
        touched: false,
        error: defaultRequiredError,
    },
    summary: {
        value: "Summary",
        touched: false,
        error: defaultRequiredError,
    },
    type: {
        value: "",
        touched: false,
        error: defaultRequiredError,
    },
    sections: [],
};

export const weightedTicketTemplateCreationSlice = createSlice({
    name: "weightedTicketTemplateCreation",
    initialState,
    reducers: {
        resetWeightedTicketTemplateCreationState: (
            state: IWeightedTicketTemplateCreationState
        ) => {
            return initialState;
        },
        updateWeightedTicketTemplateCreationTitle: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<string>
        ) => {
            const error = ControlValidator.string()
                .required(defaultRequiredError)
                .validate(action.payload);
            return {
                ...state,
                title: {
                    touched: true,
                    value: action.payload,
                    error,
                },
            };
        },
        updateWeightedTicketTemplateCreationName: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<string>
        ) => {
            const error = ControlValidator.string()
                .required(defaultRequiredError)
                .validate(action.payload);
            return {
                ...state,
                name: {
                    touched: true,
                    value: action.payload,
                    error,
                },
            };
        },
        updateWeightedTicketTemplateCreationDescription: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<string>
        ) => {
            const error = ControlValidator.string()
                .required(defaultRequiredError)
                .validate(action.payload);
            return {
                ...state,
                description: {
                    touched: true,
                    value: action.payload,
                    error,
                },
            };
        },
        updateWeightedTicketTemplateCreationSummary: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<string>
        ) => {
            const error = ControlValidator.string()
                .required(defaultRequiredError)
                .validate(action.payload);
            return {
                ...state,
                summary: {
                    touched: true,
                    value: action.payload,
                    error,
                },
            };
        },
        overrideWeightedTicketCreationSection: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                value: IWeightedSection;
                index: number;
            }>
        ) => {
            const clonedSections = cloneDeep(state.sections);
            const { index, value: updatedValue } = action.payload;

            const updatedError = ControlValidator.string()
                .required(defaultRequiredError)
                .validate(updatedValue.label);

            const updatedSection = {
                value: updatedValue,
                error: updatedError,
            };

            clonedSections[index] = updatedSection;
            return {
                ...state,
                sections: clonedSections,
            };
        },
        insertWeightedTicketCreationSection: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                value: IWeightedSection;
                index: number;
            }>
        ) => {
            const { index, value } = action.payload;
            const clonedSections = cloneDeep(state.sections);
            let error = "";

            if (value.type === "text") {
                error = ControlValidator.string()
                    .required(defaultRequiredError)
                    .validate(value.label);
            }

            if (index === -1) {
                return {
                    ...state,
                    sections: [
                        {
                            value,
                            error,
                        },
                        ...clonedSections,
                    ],
                };
            } else {
                const beforeSections = clonedSections.slice(0, index);
                const afterSections = clonedSections.slice(index);
                const updatedSections = [
                    ...beforeSections,
                    {
                        value,
                        error,
                    },
                    ...afterSections,
                ];
                return {
                    ...state,
                    sections: updatedSections,
                };
            }
        },
    },
});

export const {
    updateWeightedTicketTemplateCreationName,
    updateWeightedTicketTemplateCreationDescription,
    resetWeightedTicketTemplateCreationState,
    updateWeightedTicketTemplateCreationTitle,
    updateWeightedTicketTemplateCreationSummary,
    overrideWeightedTicketCreationSection,
    insertWeightedTicketCreationSection,
} = weightedTicketTemplateCreationSlice.actions;

export default weightedTicketTemplateCreationSlice.reducer;
