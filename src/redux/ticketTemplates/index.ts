import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StringValidator } from "../../classes/StringValidator";
import { cloneDeep } from "lodash";
import { Section } from "../../models/ticketTemplate/section";
import { ITextSection } from "../../models/ticketTemplate/section/textSection";
import { INumberSection } from "../../models/ticketTemplate/section/numberSection";
import mathEvaluator from "math-expression-evaluator";
import { ITicketTemplate } from "../../models/ticketTemplate";

export interface ITicketTemplateTextSectionControlState {
    value: ITextSection;
    error: string;
}

export interface ITicketTemplateNumberSectionControlState {
    value: INumberSection;
    labelError: string;
    minError: string;
    maxError: string;
    aliasError: string;
}

type TicketTemplateSectionsWithControlState =
    | ITicketTemplateTextSectionControlState
    | ITicketTemplateNumberSectionControlState;

export const createTicketTemplateId = "CREATE-TICKET-TEMPLATE-ID";

export interface ITicketTemplateControlState {
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
    sections: TicketTemplateSectionsWithControlState[];
    priorityWeightingCalculation: {
        value: string;
        error: string;
    };
}

export interface ITicketTemplateControlStateMapping {
    [ticketTemplateId: string]: ITicketTemplateControlState;
}

export const ticketTemplatesControlStateErrors = {
    title: "A title is required",
    summary: "A summary is required",
    name: "A name is required",
    description: "A description is required",
    generic: "This field is required",
    minError: "Min is greater than max",
    maxError: "Max is less than min",
    aliasError: "The alias must be one word and only characters a through z.",
};

export const initialTicketTemplateControlStateMapping: ITicketTemplateControlStateMapping = {
    [createTicketTemplateId]: {
        name: {
            value: "",
            touched: false,
            error: ticketTemplatesControlStateErrors.title,
        },
        description: {
            value: "",
            touched: false,
            error: ticketTemplatesControlStateErrors.summary,
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

export const ticketTemplateSlice = createSlice({
    name: "ticketTemplate",
    initialState: initialTicketTemplateControlStateMapping,
    reducers: {
        resetWeightedTicketTemplateCreationState: () => {
            return initialTicketTemplateControlStateMapping;
        },
        setWeightedTicketTemplateCreationFromExistingTicketTemplate: (
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<{
                ticketTemplateId: string;
            }>
        ) => {
            const { ticketTemplateId } = action.payload;
            const existingTicketTemplateState = cloneDeep(
                state[ticketTemplateId]
            );
            existingTicketTemplateState.name.value = `${existingTicketTemplateState.name.value} (Copy)`;
            if (!existingTicketTemplateState) {
                return state;
            }
            state[createTicketTemplateId] = existingTicketTemplateState;
            return state;
        },
        setWeightedTicketTemplate: (
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<{
                ticketTemplate: ITicketTemplate;
                ticketTemplateId: string;
            }>
        ) => {
            const { ticketTemplate, ticketTemplateId } = action.payload;
            return mappingFromTicketTemplateMetadata(state, [
                {
                    ticketTemplate,
                    ticketTemplateId,
                },
            ]);
        },
        setWeightedTicketTemplates: (
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<ITicketTemplate[]>
        ) => {
            return mappingFromTicketTemplateMetadata(
                state,
                action.payload.map((ticketTemplate) => {
                    return {
                        ticketTemplate,
                        ticketTemplateId: ticketTemplate.shortenedItemId,
                    };
                })
            );
        },
        updateWeightedTicketTemplateCreationTitle: (
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<{
                title: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { title, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(ticketTemplatesControlStateErrors.title)
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
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<{
                name: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { name, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(ticketTemplatesControlStateErrors.name)
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
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<{
                description: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { description, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(ticketTemplatesControlStateErrors.description)
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
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<{
                summary: string;
                ticketTemplateId: string;
            }>
        ) => {
            const { summary, ticketTemplateId } = action.payload;
            const error = new StringValidator()
                .required(ticketTemplatesControlStateErrors.summary)
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
            state: ITicketTemplateControlStateMapping,
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
            const ticketTemplate = state[ticketTemplateId];

            const clonedSections = cloneDeep(ticketTemplate.sections);
            const controlState = controlStateFromSection(updatedValue);
            clonedSections[index] = controlState;

            if (controlState.value.type === "text") {
                return {
                    ...state,
                    [ticketTemplateId]: {
                        ...ticketTemplate,
                        sections: clonedSections,
                    },
                };
            } else {
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
            state: ITicketTemplateControlStateMapping,
            action: PayloadAction<{
                value: Section;
                index: number;
                ticketTemplateId: string;
            }>
        ) => {
            const { index, value, ticketTemplateId } = action.payload;
            const ticketTemplate = state[ticketTemplateId];
            const clonedSections = cloneDeep(ticketTemplate.sections);
            let sectionWithControls: TicketTemplateSectionsWithControlState;

            if (value.type === "text") {
                const weightedTextSection = value as ITextSection;
                const weightedTextSectionWithControls: ITicketTemplateTextSectionControlState = {
                    value: weightedTextSection,
                    error: new StringValidator()
                        .required(ticketTemplatesControlStateErrors.generic)
                        .validate(value.label),
                };
                sectionWithControls = weightedTextSectionWithControls;
            } else if (value.type === "number") {
                const weightedNumberSection = value as INumberSection;

                const updatedLabelError = new StringValidator()
                    .required(ticketTemplatesControlStateErrors.generic)
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

                const weightedNumberSectionWithControls: ITicketTemplateNumberSectionControlState = {
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
            state: ITicketTemplateControlStateMapping,
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
            state: ITicketTemplateControlStateMapping,
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
    sections: TicketTemplateSectionsWithControlState[],
    priorityWeightingCalculation: string
) {
    const validAliasList = sections
        .filter((section) => {
            return section.value.type === "number" && !!section.value.alias;
        })
        .map(
            (section) =>
                (section as ITicketTemplateNumberSectionControlState).value
                    .alias
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

function mappingFromTicketTemplateMetadata(
    state: ITicketTemplateControlStateMapping,
    ticketTemplateMetadataList: {
        ticketTemplateId: string;
        ticketTemplate: ITicketTemplate;
    }[]
): ITicketTemplateControlStateMapping {
    const ticketTemplateObject = ticketTemplateMetadataList.reduce<{
        [ticketTemplateId: string]: ITicketTemplateControlState;
    }>((mapping, ticketTemplateMetadata) => {
        const { ticketTemplateId, ticketTemplate } = ticketTemplateMetadata;
        mapping[ticketTemplateId] = {
            name: {
                value: ticketTemplate.name,
                touched: false,
                error: "",
            },
            description: {
                value: ticketTemplate.description,
                touched: false,
                error: "",
            },
            title: {
                value: ticketTemplate.title.label,
                touched: false,
                error: "",
            },
            summary: {
                value: ticketTemplate.summary.label,
                touched: false,
                error: "",
            },
            sections: ticketTemplate.sections.map((section) => {
                if (section.type === "text") {
                    return {
                        value: section,
                        error: "",
                    } as ITicketTemplateTextSectionControlState;
                } else {
                    return {
                        value: section,
                        labelError: "",
                        minError: "",
                        maxError: "",
                        aliasError: "",
                    } as ITicketTemplateNumberSectionControlState;
                }
            }),
            priorityWeightingCalculation: {
                value: ticketTemplate.priorityWeightingCalculation,
                error: "",
            },
        };
        return mapping;
    }, {});
    return {
        ...state,
        ...ticketTemplateObject,
    };
}

function controlStateFromSection(section: Section) {
    if (section.type === "text") {
        const weightedTextSection = section as ITextSection;
        const updatedError = new StringValidator()
            .required(ticketTemplatesControlStateErrors.generic)
            .validate(section.label);

        const controlState: ITicketTemplateTextSectionControlState = {
            value: weightedTextSection,
            error: updatedError,
        };

        return controlState;
    } else {
        const weightedNumberSection = section as INumberSection;
        const updatedLabelError = new StringValidator()
            .required(ticketTemplatesControlStateErrors.generic)
            .validate(section.label);

        const minExists = weightedNumberSection.minValue !== undefined;
        const maxExists = weightedNumberSection.maxValue !== undefined;
        const updatedMinError =
            minExists && maxExists && section.minValue! > section.maxValue!
                ? ticketTemplatesControlStateErrors.minError
                : "";
        const updatedMaxError =
            minExists && maxExists && section.maxValue! < section.minValue!
                ? ticketTemplatesControlStateErrors.maxError
                : "";

        const aliasError = new StringValidator()
            .onlyAThroughZ(ticketTemplatesControlStateErrors.aliasError)
            .validate(section.alias);

        const numberControlState: ITicketTemplateNumberSectionControlState = {
            value: weightedNumberSection,
            labelError: updatedLabelError,
            minError: updatedMinError,
            maxError: updatedMaxError,
            aliasError,
        };
        return numberControlState;
    }
}

export const {
    setWeightedTicketTemplateCreationFromExistingTicketTemplate,
    updateWeightedTicketTemplateCreationName,
    updateWeightedTicketTemplateCreationDescription,
    resetWeightedTicketTemplateCreationState,
    updateWeightedTicketTemplateCreationTitle,
    updateWeightedTicketTemplateCreationSummary,
    overrideWeightedTicketCreationSection,
    insertWeightedTicketCreationSection,
    deleteWeightedTicketTemplateCreationSection,
    updatePriorityWeightingCalculation,
    setWeightedTicketTemplate,
    setWeightedTicketTemplates,
} = ticketTemplateSlice.actions;

export default ticketTemplateSlice.reducer;
