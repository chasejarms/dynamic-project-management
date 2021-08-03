import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany } from "../../models/company";
import { IUser } from "../../models/user";

export interface IAppBootstrapInformationState {
    companies: ICompany[];
    users: IUser[];
    isLoading: boolean;
}

const initialState: IAppBootstrapInformationState = {
    companies: [],
    users: [],
    isLoading: true,
};

export const appBootstrapInformationSlice = createSlice({
    name: "appBootstrapInformation",
    initialState,
    reducers: {
        setAppBootstrapInformation: (
            state: IAppBootstrapInformationState,
            action: PayloadAction<IAppBootstrapInformationState>
        ) => {
            return action.payload;
        },
        resetAppBootstrapInformation: (
            state: IAppBootstrapInformationState
        ) => {
            return initialState;
        },
    },
});

export const {
    setAppBootstrapInformation,
    resetAppBootstrapInformation,
} = appBootstrapInformationSlice.actions;

export default appBootstrapInformationSlice.reducer;
