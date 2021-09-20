import { configureStore } from "@reduxjs/toolkit";
import boards from "./boards";
import appBootstrapInformation from "./appBootstrapInformation";
import ticketCreation from "./ticketCreation";
import weightedTicketTemplateCreation from "./ticketTemplates";
import ticketControlMappedState from "./ticketControlMappedState";
import boardColumnEditMappedState from "./boardColumnEditMappedState";
import { IStoreStatePartial } from "./storeState";

export const createStore = (preloadedState?: IStoreStatePartial) => {
    return configureStore({
        reducer: {
            boards,
            appBootstrapInformation,
            ticketCreation,
            weightedTicketTemplateCreation,
            ticketControlMappedState,
            boardColumnEditMappedState,
        },
        preloadedState,
    });
};

export const store = createStore();
