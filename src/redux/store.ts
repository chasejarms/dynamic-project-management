import { configureStore } from "@reduxjs/toolkit";
import boards from "./boards";
import appBootstrapInformation from "./appBootstrapInformation";
import ticketCreation from "./ticketCreation";
import weightedTicketTemplateCreation from "./ticketTemplates";
import ticketControlMappedState from "./ticketControlMappedState";
import boardColumnEditMappedState from "./boardColumnEditMappedState";

export const store = configureStore({
    reducer: {
        boards,
        appBootstrapInformation,
        ticketCreation,
        weightedTicketTemplateCreation,
        ticketControlMappedState,
        boardColumnEditMappedState,
    },
});
