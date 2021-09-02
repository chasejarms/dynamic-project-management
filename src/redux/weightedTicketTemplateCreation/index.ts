import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControlValidator } from "../../classes/ControlValidator";
import { cloneDeep } from "lodash";
import { IWeightedSection } from "../../models/weightedSections";
import { IWeightedTextSection } from "../../models/weightedSections/weightedTextSection";
import { IWeightedNumberSection } from "../../models/weightedSections/weightedNumberSection";

export interface WeightedTextSectionWithControls {
    value: IWeightedTextSection;
    error: string;
}

export interface WeightedNumberSectionWithControls {
    value: IWeightedNumberSection;
    labelError: string;
    minError: string;
    maxError: string;
    aliasError: string;
}

type WeightedSectionWithControls =
    | WeightedTextSectionWithControls
    | WeightedNumberSectionWithControls;

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
    sections: WeightedSectionWithControls[];
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
        error: "",
    },
    summary: {
        value: "Summary",
        touched: false,
        error: "",
    },
    sections: [],
};

export const weightedTicketTemplateCreationSlice = createSlice({
    name: "weightedTicketTemplateCreation",
    initialState,
    reducers: {
        resetWeightedTicketTemplateCreationState: () => {
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

            if (updatedValue.type === "text") {
                const weightedTextSection = updatedValue as IWeightedTextSection;
                const updatedError = ControlValidator.string()
                    .required(defaultRequiredError)
                    .validate(updatedValue.label);

                const updatedSection: WeightedTextSectionWithControls = {
                    value: weightedTextSection,
                    error: updatedError,
                };

                clonedSections[index] = updatedSection;
                return {
                    ...state,
                    sections: clonedSections,
                };
            } else if (updatedValue.type === "number") {
                const weightedNumberSection = updatedValue as IWeightedNumberSection;
                const updatedLabelError = ControlValidator.string()
                    .required(defaultRequiredError)
                    .validate(updatedValue.label);

                const minExists = weightedNumberSection.minValue !== undefined;
                const maxExists = weightedNumberSection.maxValue !== undefined;
                const updatedMinError =
                    minExists &&
                    maxExists &&
                    updatedValue.minValue! > updatedValue.maxValue!
                        ? "Min is greater than max"
                        : "";
                const updatedMaxError =
                    minExists &&
                    maxExists &&
                    updatedValue.maxValue! < updatedValue.minValue!
                        ? "Max is less than min"
                        : "";

                const aliasError = ControlValidator.string()
                    .onlyAThroughZ(
                        "The alias must be one word and only characters a through z."
                    )
                    .validate(updatedValue.alias);

                const updatedSection: WeightedNumberSectionWithControls = {
                    value: weightedNumberSection,
                    labelError: updatedLabelError,
                    minError: updatedMinError,
                    maxError: updatedMaxError,
                    aliasError,
                };

                clonedSections[index] = updatedSection;
                return {
                    ...state,
                    sections: clonedSections,
                };
            }
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
            let sectionWithControls: WeightedSectionWithControls;

            if (value.type === "text") {
                const weightedTextSection = value as IWeightedTextSection;
                const weightedTextSectionWithControls: WeightedTextSectionWithControls = {
                    value: weightedTextSection,
                    error: ControlValidator.string()
                        .required(defaultRequiredError)
                        .validate(value.label),
                };
                sectionWithControls = weightedTextSectionWithControls;
            } else if (value.type === "number") {
                const weightedNumberSection = value as IWeightedNumberSection;

                const updatedLabelError = ControlValidator.string()
                    .required(defaultRequiredError)
                    .validate(weightedNumberSection.label);

                const minExists = weightedNumberSection.minValue !== undefined;
                const maxExists = weightedNumberSection.maxValue !== undefined;
                const updatedMinError =
                    minExists &&
                    maxExists &&
                    weightedNumberSection.minValue! >
                        weightedNumberSection.maxValue!
                        ? "Min is greater than max"
                        : "";
                const updatedMaxError =
                    minExists &&
                    maxExists &&
                    weightedNumberSection.maxValue! <
                        weightedNumberSection.minValue!
                        ? "Max is less than min"
                        : "";

                const aliasError = ControlValidator.string()
                    .onlyAThroughZ(
                        "The alias must be one word and only characters a through z."
                    )
                    .validate(weightedNumberSection.alias);

                const weightedNumberSectionWithControls: WeightedNumberSectionWithControls = {
                    value: weightedNumberSection,
                    labelError: updatedLabelError,
                    minError: updatedMinError,
                    maxError: updatedMaxError,
                    aliasError,
                };

                sectionWithControls = weightedNumberSectionWithControls;
            }

            if (!sectionWithControls!) {
                return state;
            }

            if (index === -1) {
                return {
                    ...state,
                    sections: [sectionWithControls, ...clonedSections],
                };
            } else {
                const beforeSections = clonedSections.slice(0, index + 1);
                const afterSections = clonedSections.slice(index + 1);
                const updatedSections = [
                    ...beforeSections,
                    sectionWithControls,
                    ...afterSections,
                ];
                return {
                    ...state,
                    sections: updatedSections,
                };
            }
        },
        deleteWeightedTicketTemplateCreationSection: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<number>
        ) => {
            const sectionsWithoutRemovedSection = state.sections.filter(
                (_, index) => {
                    return index !== action.payload;
                }
            );
            return {
                ...state,
                sections: sectionsWithoutRemovedSection,
            };
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
    deleteWeightedTicketTemplateCreationSection,
} = weightedTicketTemplateCreationSlice.actions;

export default weightedTicketTemplateCreationSlice.reducer;
