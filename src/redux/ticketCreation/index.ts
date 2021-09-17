import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StringValidator } from "../../classes/StringValidator";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { cloneDeep } from "lodash";

export interface ITicketCreationState {
    ticketTemplate: null | ITicketTemplate;
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
    sections: {
        value: string;
    }[];
    startingColumn: string;
}

export const ticketCreationDefaultRequiredError = "This field is required";
export const initialTicketCreationState: ITicketCreationState = {
    ticketTemplate: null,
    title: {
        value: "",
        touched: false,
        error: ticketCreationDefaultRequiredError,
    },
    summary: {
        value: "",
        touched: false,
        error: ticketCreationDefaultRequiredError,
    },
    sections: [],
    startingColumn: "BACKLOG",
};

export const ticketCreationSlice = createSlice({
    name: "ticketCreation",
    initialState: initialTicketCreationState,
    reducers: {
        resetTicketCreation: () => {
            return initialTicketCreationState;
        },
        updateTicketTitle: (
            state: ITicketCreationState,
            action: PayloadAction<string>
        ) => {
            const error = new StringValidator()
                .required(ticketCreationDefaultRequiredError)
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
        updateTicketSummary: (
            state: ITicketCreationState,
            action: PayloadAction<string>
        ) => {
            const error = new StringValidator()
                .required(ticketCreationDefaultRequiredError)
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
        updateTicketTemplate: (
            state: ITicketCreationState,
            action: PayloadAction<ITicketTemplate | null>
        ) => {
            const sections: {
                value: string;
            }[] = [];
            if (action.payload !== null) {
                action.payload.sections.forEach((section) => {
                    sections.push({
                        value: "",
                    });
                });
            }
            return {
                ...state,
                ticketTemplate: action.payload,
                sections,
            };
        },
        updateSection: (
            state: ITicketCreationState,
            action: PayloadAction<{
                value: string;
                index: number;
            }>
        ) => {
            const clonedSections = cloneDeep(state.sections);
            const existingSection = clonedSections[action.payload.index];
            existingSection.value = action.payload.value;
            return {
                ...state,
                sections: clonedSections,
            };
        },
        updateStartingColumn: (
            state: ITicketCreationState,
            action: PayloadAction<string>
        ) => {
            return {
                ...state,
                startingColumn: action.payload,
            };
        },
    },
});

export const {
    resetTicketCreation,
    updateTicketTitle,
    updateTicketSummary,
    updateTicketTemplate,
    updateSection,
    updateStartingColumn,
} = ticketCreationSlice.actions;

export default ticketCreationSlice.reducer;
