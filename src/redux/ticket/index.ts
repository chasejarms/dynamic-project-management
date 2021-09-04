import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControlValidator } from "../../classes/ControlValidator";
import { ITicketTemplate } from "../../models/ticketTemplate";
import { cloneDeep } from "lodash";

export const ticketPreviewId = "TICKET_PREVIEW";
export const ticketCreateId = "TICKET_CREATE";

export interface ITicket {
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
}

export interface ITicketMappingState {
    [ticketId: string]: ITicket;
}

const defaultRequiredError = "This field is required";
const initialState: ITicketMappingState = {
    TICKET_PREVIEW: {
        ticketTemplate: null,
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
};

export const ticketMappingSlice = createSlice({
    name: "ticketMapping",
    initialState,
    reducers: {
        setInitialTicketData: (
            state: ITicketMappingState,
            action: PayloadAction<{
                value: string;
                ticket: ITicket;
                ticketId: string;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            clonedState[action.payload.ticketId] = action.payload.ticket;
            return clonedState;
        },
        updateTicketTitle: (
            state: ITicketMappingState,
            action: PayloadAction<{
                value: string;
                ticketId: string;
            }>
        ) => {
            const error = ControlValidator.string()
                .required(defaultRequiredError)
                .validate(action.payload.value);
            const clonedState = cloneDeep(state);
            const existingTicket = clonedState[action.payload.ticketId];
            return {
                ...clonedState,
                [action.payload.ticketId]: {
                    ...existingTicket,
                    title: {
                        touched: true,
                        value: action.payload.value,
                        error,
                    },
                },
            };
        },
        // updateTicketSummary: (
        //     state: ITicketMappingState,
        //     action: PayloadAction<string>
        // ) => {
        //     const error = ControlValidator.string()
        //         .required(defaultRequiredError)
        //         .validate(action.payload);
        //     return {
        //         ...state,
        //         summary: {
        //             touched: true,
        //             value: action.payload,
        //             error,
        //         },
        //     };
        // },
        // updateTicketTemplate: (
        //     state: ITicketMappingState,
        //     action: PayloadAction<ITicketTemplate | null>
        // ) => {
        //     const sections: {
        //         value: string;
        //     }[] = [];
        //     if (action.payload !== null) {
        //         action.payload.sections.forEach((section) => {
        //             sections.push({
        //                 value: "",
        //             });
        //         });
        //     }
        //     return {
        //         ...state,
        //         ticketTemplate: action.payload,
        //         sections,
        //     };
        // },
        // updateSection: (
        //     state: ITicketMappingState,
        //     action: PayloadAction<{
        //         value: string;
        //         index: number;
        //     }>
        // ) => {
        //     const clonedSections = cloneDeep(state.sections);
        //     const existingSection = clonedSections[action.payload.index];
        //     existingSection.value = action.payload.value;
        //     return {
        //         ...state,
        //         sections: clonedSections,
        //     };
        // },
        // updateStartingColumn: (
        //     state: ITicketMappingState,
        //     action: PayloadAction<string>
        // ) => {
        //     return {
        //         ...state,
        //         startingColumn: action.payload,
        //     };
        // },
    },
});

export const {
    setInitialTicketData,
    updateTicketTitle,
    // updateTicketTitle,
    // updateTicketSummary,
    // updateTicketTemplate,
    // updateSection,
    // updateStartingColumn,
} = ticketMappingSlice.actions;

export default ticketMappingSlice.reducer;
