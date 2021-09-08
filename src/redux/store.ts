import { configureStore } from "@reduxjs/toolkit";
import boards from "./boards";
import appBootstrapInformation from "./appBootstrapInformation";
import ticketCreation from "./ticketCreation";
import weightedTicketTemplateCreation from "./ticketTemplates";
import ticket from "./ticket";

export const store = configureStore({
    reducer: {
        boards,
        appBootstrapInformation,
        ticketCreation,
        weightedTicketTemplateCreation,
        ticket,
    },
});
