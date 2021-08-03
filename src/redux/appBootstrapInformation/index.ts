import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany } from "../../models/company";
import { IUser } from "../../models/user";

export interface IAppBootstrapInformationState {
    companies: ICompany[];
    users: IUser[];
    isLoading: boolean;
}

export const appBootstrapInformationSlice = createSlice({
    name: "appBootstrapInformation",
    initialState: {
        companies: [],
        users: [],
        isLoading: true,
    } as IAppBootstrapInformationState,
    reducers: {
        setAppBootstrapInformation: (
            state: IAppBootstrapInformationState,
            action: PayloadAction<IAppBootstrapInformationState>
        ) => {
            return action.payload;
        },
    },
});

export const {
    setAppBootstrapInformation,
} = appBootstrapInformationSlice.actions;

export default appBootstrapInformationSlice.reducer;
