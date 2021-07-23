import { configureStore } from "@reduxjs/toolkit";
import boards from "./boards";

export const store = configureStore({
    reducer: {
        boards,
    },
});
