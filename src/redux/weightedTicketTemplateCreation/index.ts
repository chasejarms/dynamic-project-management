import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StringValidator } from "../../classes/StringValidator";
import { cloneDeep } from "lodash";
import { Section } from "../../models/ticketTemplate/section";
import { ITextSection } from "../../models/ticketTemplate/section/textSection";
import { INumberSection } from "../../models/ticketTemplate/section/numberSection";
import mathEvaluator from "math-expression-evaluator";

export interface WeightedTextSectionWithControls {
    value: ITextSection;
    error: string;
}

export interface WeightedNumberSectionWithControls {
    value: INumberSection;
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
    priorityWeightingCalculation: {
        value: string;
        error: string;
    };
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
    priorityWeightingCalculation: {
        value: "",
        error: "",
    },
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
            const error = new StringValidator()
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
            const error = new StringValidator()
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
            const error = new StringValidator()
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
            const error = new StringValidator()
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
                value: Section;
                index: number;
            }>
        ) => {
            const clonedSections = cloneDeep(state.sections);
            const { index, value: updatedValue } = action.payload;

            if (updatedValue.type === "text") {
                const weightedTextSection = updatedValue as ITextSection;
                const updatedError = new StringValidator()
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
                const weightedNumberSection = updatedValue as INumberSection;
                const updatedLabelError = new StringValidator()
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

                const aliasError = new StringValidator()
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
                value: Section;
                index: number;
            }>
        ) => {
            const { index, value } = action.payload;
            const clonedSections = cloneDeep(state.sections);
            let sectionWithControls: WeightedSectionWithControls;

            if (value.type === "text") {
                const weightedTextSection = value as ITextSection;
                const weightedTextSectionWithControls: WeightedTextSectionWithControls = {
                    value: weightedTextSection,
                    error: new StringValidator()
                        .required(defaultRequiredError)
                        .validate(value.label),
                };
                sectionWithControls = weightedTextSectionWithControls;
            } else if (value.type === "number") {
                const weightedNumberSection = value as INumberSection;

                const updatedLabelError = new StringValidator()
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

                const aliasError = new StringValidator()
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
        updatePriorityWeightingCalculation: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<string>
        ) => {
            const updatedPriorityWeightingCalculation = action.payload;
            const validAliasList = state.sections
                .filter((section) => {
                    return (
                        section.value.type === "number" && !!section.value.alias
                    );
                })
                .map(
                    (section) =>
                        (section as WeightedNumberSectionWithControls).value
                            .alias
                );

            const error = (function () {
                if (updatedPriorityWeightingCalculation.trim() === "") {
                    return "";
                }

                const trimmedWords = updatedPriorityWeightingCalculation.match(
                    /\b[a-zA-Z]+/g
                );

                const wordsAreValid = trimmedWords
                    ? trimmedWords.every((trimmedWord) => {
                          return trimmedWord.match(/^$|^[a-zA-Z]+$/);
                      })
                    : true;

                if (!wordsAreValid) {
                    return "The provided aliases are not valid.";
                }

                const validAliasMapping = validAliasList.reduce<{
                    [aliasName: string]: boolean;
                }>((mapping, aliasName) => {
                    mapping[aliasName] = true;
                    return mapping;
                }, {});

                const aliasesExist = trimmedWords
                    ? trimmedWords.every((trimmedWord) => {
                          return validAliasMapping[trimmedWord];
                      })
                    : true;
                if (!aliasesExist) {
                    return "The provided aliases do not exist on the ticket template";
                }

                const onlyAllowedCharactersArePresent = updatedPriorityWeightingCalculation.match(
                    /^$|^[a-zA-Z0-9\.\+\-\*\/() ]+$/
                );
                if (!onlyAllowedCharactersArePresent) {
                    return "Only simple math values are allowed (parenthesis, decimals, +, -, /, *)";
                }

                try {
                    let expressionToEvaluate = updatedPriorityWeightingCalculation;
                    Object.keys(validAliasMapping).forEach((key) => {
                        expressionToEvaluate = expressionToEvaluate.replaceAll(
                            key,
                            "1"
                        );
                    });
                    mathEvaluator.eval(expressionToEvaluate);
                } catch (e) {
                    return "There is an error with the calculation setup";
                }

                return "";
            })();

            return {
                ...state,
                priorityWeightingCalculation: {
                    value: updatedPriorityWeightingCalculation,
                    error,
                },
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
    updatePriorityWeightingCalculation,
} = weightedTicketTemplateCreationSlice.actions;

export default weightedTicketTemplateCreationSlice.reducer;
