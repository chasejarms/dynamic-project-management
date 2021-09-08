import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StringValidator } from "../../classes/StringValidator";
import { cloneDeep } from "lodash";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { NumberValidator } from "../../classes/NumberValidator";
import { INumberSection } from "../../models/ticketTemplate/section/numberSection";

export const ticketPreviewId = "TICKET_PREVIEW";

export interface ISectionFormData {
    value: string | number;
    touched: boolean;
    error: string;
}

export interface ITicket {
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
    sections: ISectionFormData[];
}

export interface ITicketMappingState {
    [ticketId: string]: {
        ticket: ITicket;
        ticketTemplate: ITicketTemplate;
    };
}

const defaultRequiredError = "This field is required";
const initialState: ITicketMappingState = {
    TICKET_PREVIEW: {
        ticket: {
            title: {
                value: "",
                touched: false,
                error: defaultRequiredError,
            },
            summary: {
                value: "",
                touched: false,
                error: defaultRequiredError,
            },
            sections: [],
        },
        ticketTemplate: {
            itemId: "",
            belongsTo: "",
            shortenedItemId: "",
            name: "",
            description: "",
            title: {
                label: "Title",
            },
            summary: {
                label: "Summary",
            },
            sections: [],
            priorityWeightingCalculation: "",
        },
    },
};

export const ticketMappingSlice = createSlice({
    name: "ticketMapping",
    initialState,
    reducers: {
        setInitialTicketData: (
            state: ITicketMappingState,
            action: PayloadAction<{
                ticket: ITicket;
                ticketTemplate: ITicketTemplate;
                priorityWeightingFunction: {
                    value: string;
                    error: string;
                };
                ticketId: string;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            clonedState[action.payload.ticketId] = {
                ticket: action.payload.ticket,
                ticketTemplate: action.payload.ticketTemplate,
            };
            return clonedState;
        },
        updateTicketTitle: (
            state: ITicketMappingState,
            action: PayloadAction<{
                value: string;
                ticketId: string;
            }>
        ) => {
            const error = ticketTitleError(action.payload.value);
            const clonedState = cloneDeep(state);
            const existingTicketAndTicketTemplate =
                clonedState[action.payload.ticketId];
            return {
                ...clonedState,
                [action.payload.ticketId]: {
                    ...existingTicketAndTicketTemplate,
                    ticket: {
                        ...existingTicketAndTicketTemplate.ticket,
                        title: {
                            touched: true,
                            value: action.payload.value,
                            error,
                        },
                    },
                },
            };
        },
        updateTicketSummary: (
            state: ITicketMappingState,
            action: PayloadAction<{
                value: string;
                ticketId: string;
            }>
        ) => {
            const error = ticketSummaryError(action.payload.value);
            const clonedState = cloneDeep(state);
            const existingTicketAndTicketTemplate =
                clonedState[action.payload.ticketId];
            return {
                ...clonedState,
                [action.payload.ticketId]: {
                    ...existingTicketAndTicketTemplate,
                    ticket: {
                        ...existingTicketAndTicketTemplate.ticket,
                        summary: {
                            touched: true,
                            value: action.payload.value,
                            error,
                        },
                    },
                },
            };
        },
        updateSectionValue: (
            state: ITicketMappingState,
            action: PayloadAction<{
                index: number;
                value: string | number;
                ticketId: string;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            const { index, ticketId } = action.payload;
            const { ticket: existingTicket, ticketTemplate } = clonedState[
                ticketId
            ];
            const previousSections = existingTicket.sections;
            const beforeSectionToInsert = previousSections.slice(0, index);
            const afterSectionToInsert = previousSections.slice(index + 1);

            let sectionToInsert: ISectionFormData;
            const section = ticketTemplate.sections[index];
            if (section.type === "text") {
                const value = action.payload.value as string;

                const error = textSectionError(value, section.required);

                sectionToInsert = {
                    value,
                    error,
                    touched: true,
                };
            } else if (section.type === "number") {
                const value = action.payload.value as
                    | number
                    | undefined
                    | null
                    | "";

                const error = numberSectionError(value, section);

                sectionToInsert = {
                    value: value || "",
                    error,
                    touched: true,
                };
            }

            const updatedSections = [
                ...beforeSectionToInsert,
                sectionToInsert!,
                ...afterSectionToInsert,
            ];

            return {
                ...clonedState,
                [action.payload.ticketId]: {
                    ticket: {
                        ...existingTicket,
                        sections: updatedSections,
                    },
                    ticketTemplate,
                },
            };
        },
    },
});

export const {
    setInitialTicketData,
    updateTicketTitle,
    updateTicketSummary,
    updateSectionValue,
} = ticketMappingSlice.actions;

export function ticketSummaryError(summary: string) {
    const error = new StringValidator()
        .required(defaultRequiredError)
        .validate(summary);

    return error;
}

export function ticketTitleError(title: string) {
    const error = new StringValidator()
        .required(defaultRequiredError)
        .validate(title);

    return error;
}

export function textSectionError(value: string, required: boolean) {
    if (required) {
        return new StringValidator().required().validate(value);
    }

    return "";
}

export function numberSectionError(
    value: number | undefined | null | "",
    section: INumberSection
) {
    const numberValue =
        value !== undefined && value !== null && value !== ""
            ? Number(value)
            : value;
    const error = new NumberValidator()
        .required(section.required)
        .integer(section.allowOnlyIntegers)
        .max(section.maxValue !== undefined, section.maxValue!)
        .min(section.minValue !== undefined, section.minValue!)
        .validate(numberValue);

    return error;
}

export default ticketMappingSlice.reducer;
