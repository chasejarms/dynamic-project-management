import { configureStore } from "@reduxjs/toolkit";
import boards from "./boards";
import appBootstrapInformation from "./appBootstrapInformation";
import ticketCreation from "./ticketCreation";

export const store = configureStore({
    reducer: {
        boards,
        appBootstrapInformation,
        ticketCreation,
    },
});
