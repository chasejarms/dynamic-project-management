import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IColumn } from "../../models/column";
import { cloneDeep } from "lodash";

export interface IColumnControl extends IColumn {
    labelError: string;
}

export interface IBoardColumnEditMappedState {
    [boardId: string]: {
        localColumnControls: IColumnControl[];
        databaseColumns: IColumn[];
    };
}

const initialState: IBoardColumnEditMappedState = {};

export const boardColumnEditMappedSlice = createSlice({
    name: "boardColumnEdit",
    initialState,
    reducers: {
        setInitialBoardColumnState: (
            state: IBoardColumnEditMappedState,
            action: PayloadAction<{
                boardId: string;
                columns: IColumn[];
            }>
        ) => {
            const clonedState = cloneDeep(state);
            const { boardId, columns } = action.payload;
            clonedState[boardId] = {
                localColumnControls: columns.map((column) => {
                    return {
                        ...column,
                        labelError: "",
                    };
                }),
                databaseColumns: columns,
            };
            return clonedState;
        },
    },
});

export const {
    setInitialBoardColumnState,
} = boardColumnEditMappedSlice.actions;

export default boardColumnEditMappedSlice.reducer;
