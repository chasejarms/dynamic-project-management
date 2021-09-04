import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StringValidator } from "../../classes/StringValidator";
import { cloneDeep } from "lodash";
import { Section } from "../../models/ticketTemplate/section";
import { ITicketTemplate } from "../../models/ticketTemplate";

export const ticketPreviewId = "TICKET_PREVIEW";
export const ticketCreateId = "TICKET_CREATE";

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
    sections: {
        value: string | number;
        touched: boolean;
        error: string;
    }[];
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
            const error = new StringValidator()
                .required(defaultRequiredError)
                .validate(action.payload.value);
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
            const error = new StringValidator()
                .required(defaultRequiredError)
                .validate(action.payload.value);
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
        addSection: (
            state: ITicketMappingState,
            action: PayloadAction<{
                index: number;
                value: string | number;
                ticketId: string;
                updatedTicketTemplate: ITicketTemplate;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            const { ticket: existingTicket } = clonedState[
                action.payload.ticketId
            ];
            const previousSections = existingTicket.sections;
            const beforeSectionToInsert = previousSections.slice(
                0,
                action.payload.index + 1
            );
            const afterSectionToInsert = previousSections.slice(
                action.payload.index + 1
            );

            let error = "";
            const section =
                action.payload.updatedTicketTemplate.sections[
                    action.payload.index
                ];
            if (section.type === "text") {
                if (section.required) {
                    error = new StringValidator()
                        .required()
                        .validate(action.payload.value.toString());
                }
            } else if (section.type === "number") {
            }

            const sectionToInsert = {
                value: action.payload.value,
                error: "",
                touched: false,
            };

            const updatedSections = [
                ...beforeSectionToInsert,
                sectionToInsert,
                ...afterSectionToInsert,
            ];

            return {
                ...clonedState,
                [action.payload.ticketId]: {
                    ticket: {
                        ...existingTicket,
                        sections: updatedSections,
                    },
                    ticketTemplate: action.payload.updatedTicketTemplate,
                },
            };
        },
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
    updateTicketSummary,
    // updateTicketTitle,
    // updateTicketSummary,
    // updateTicketTemplate,
    // updateSection,
    // updateStartingColumn,
} = ticketMappingSlice.actions;

export default ticketMappingSlice.reducer;
