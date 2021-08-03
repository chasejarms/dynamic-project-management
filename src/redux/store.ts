import { configureStore } from "@reduxjs/toolkit";
import boards from "./boards";
import appBootstrapInformation from "./appBootstrapInformation";

export const store = configureStore({
    reducer: {
        boards,
        appBootstrapInformation,
    },
});
