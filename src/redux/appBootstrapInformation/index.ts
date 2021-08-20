import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
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
        setUserAsBoardAdmin: (
            state: IAppBootstrapInformationState,
            action: PayloadAction<{
                companyId: string;
                boardId: string;
            }>
        ) => {
            const { companyId, boardId } = action.payload;
            const user = state.users.find((user) => {
                return user.belongsTo.includes(companyId);
            });
            if (!user) return state;

            const clonedUser = cloneDeep(user);
            clonedUser.boardRights[boardId] = {
                isAdmin: true,
            };

            const updatedUsers = state.users.map((user) => {
                const isSameCompany = user.belongsTo.includes(companyId);
                if (isSameCompany) {
                    return clonedUser;
                } else {
                    return user;
                }
            });

            return {
                ...state,
                users: updatedUsers,
            };
        },
    },
});

export const {
    setAppBootstrapInformation,
    resetAppBootstrapInformation,
    setUserAsBoardAdmin,
} = appBootstrapInformationSlice.actions;

export default appBootstrapInformationSlice.reducer;
