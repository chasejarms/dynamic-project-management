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

export const createTicketTemplateId = "CREATE-TICKET-TEMPLATE-ID";

export interface IWeightedTicketTemplateCreationState {
    [ticketTemplateId: string]: {
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
    };
}

const defaultRequiredError = "This field is required";
const initialState: IWeightedTicketTemplateCreationState = {
    [createTicketTemplateId]: {
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
            action: PayloadAction<{
                title: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { title, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(defaultRequiredError)
                .validate(title);
            return {
                ...state,
                [ticketTemplateId]: {
                    ...state[ticketTemplateId],
                    title: {
                        touched: true,
                        value: title,
                        error,
                    },
                },
            };
        },
        updateWeightedTicketTemplateCreationName: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                name: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { name, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(defaultRequiredError)
                .validate(name);
            return {
                ...state,
                [ticketTemplateId]: {
                    ...state[ticketTemplateId],
                    name: {
                        touched: true,
                        value: name,
                        error,
                    },
                },
            };
        },
        updateWeightedTicketTemplateCreationDescription: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                description: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { description, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(defaultRequiredError)
                .validate(description);
            return {
                ...state,
                [ticketTemplateId]: {
                    ...state[ticketTemplateId],
                    description: {
                        touched: true,
                        value: description,
                        error,
                    },
                },
            };
        },
        updateWeightedTicketTemplateCreationSummary: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                summary: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { summary, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(defaultRequiredError)
                .validate(summary);
            return {
                ...state,
                [ticketTemplateId]: {
                    ...state[ticketTemplateId],
                    summary: {
                        touched: true,
                        value: summary,
                        error,
                    },
                },
            };
        },
        overrideWeightedTicketCreationSection: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                value: Section;
                index: number;
                ticketTemplateId: string;
            }>
        ) => {
            const {
                index,
                value: updatedValue,
                ticketTemplateId,
            } = action.payload;
            const ticketTemplate = state.ticketTemplateId;

            const clonedSections = cloneDeep(ticketTemplate.sections);

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
                    [ticketTemplateId]: {
                        ...ticketTemplate,
                        sections: clonedSections,
                    },
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
                const error = priorityWeightingCalculationError(
                    clonedSections,
                    ticketTemplate.priorityWeightingCalculation.value
                );
                return {
                    ...state,
                    [ticketTemplateId]: {
                        ...ticketTemplate,
                        sections: clonedSections,
                        priorityWeightingCalculation: {
                            value:
                                ticketTemplate.priorityWeightingCalculation
                                    .value,
                            error,
                        },
                    },
                };
            }
        },
        insertWeightedTicketCreationSection: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                value: Section;
                index: number;
                ticketTemplateId: string;
            }>
        ) => {
            const { index, value, ticketTemplateId } = action.payload;
            const ticketTemplate = state[ticketTemplateId];
            const clonedSections = cloneDeep(ticketTemplate.sections);
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
                    [ticketTemplateId]: {
                        ...ticketTemplate,
                        sections: [sectionWithControls, ...clonedSections],
                    },
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
                    [ticketTemplateId]: {
                        ...ticketTemplate,
                        sections: updatedSections,
                    },
                };
            }
        },
        deleteWeightedTicketTemplateCreationSection: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                index: number;
                ticketTemplateId: string;
            }>
        ) => {
            const { index, ticketTemplateId } = action.payload;
            const ticketTemplate = state[ticketTemplateId];
            const sectionsWithoutRemovedSection = ticketTemplate.sections.filter(
                (_, compareIndex) => {
                    return compareIndex !== index;
                }
            );
            return {
                ...state,
                [ticketTemplateId]: {
                    ...ticketTemplate,
                    sections: sectionsWithoutRemovedSection,
                },
            };
        },
        updatePriorityWeightingCalculation: (
            state: IWeightedTicketTemplateCreationState,
            action: PayloadAction<{
                priorityWeightingCalculation: string;
                ticketTemplateId: string;
            }>
        ) => {
            const {
                priorityWeightingCalculation,
                ticketTemplateId,
            } = action.payload;
            const ticketTemplate = state[ticketTemplateId];
            const error = priorityWeightingCalculationError(
                ticketTemplate.sections,
                priorityWeightingCalculation
            );

            return {
                ...state,
                [ticketTemplateId]: {
                    ...ticketTemplate,
                    priorityWeightingCalculation: {
                        value: priorityWeightingCalculation,
                        error,
                    },
                },
            };
        },
    },
});

function priorityWeightingCalculationError(
    sections: WeightedSectionWithControls[],
    priorityWeightingCalculation: string
) {
    const validAliasList = sections
        .filter((section) => {
            return section.value.type === "number" && !!section.value.alias;
        })
        .map(
            (section) =>
                (section as WeightedNumberSectionWithControls).value.alias
        );

    const error = (function () {
        if (priorityWeightingCalculation.trim() === "") {
            return "";
        }

        const trimmedWords = priorityWeightingCalculation.match(/\b[a-zA-Z]+/g);

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

        const onlyAllowedCharactersArePresent = priorityWeightingCalculation.match(
            /^$|^[a-zA-Z0-9\.\+\-\*\/() ]+$/
        );
        if (!onlyAllowedCharactersArePresent) {
            return "Only simple math values are allowed (parenthesis, decimals, +, -, /, *)";
        }

        try {
            let expressionToEvaluate = priorityWeightingCalculation;
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

    return error;
}

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
