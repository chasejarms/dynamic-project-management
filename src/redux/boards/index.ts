import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoard } from "../../models/board";

export interface IBoardsState {
    [boardId: string]: IBoard;
}

const initialState: {
    [boardId: string]: IBoard;
} = {};

export const boardsSlice = createSlice({
    name: "boards",
    initialState,
    reducers: {
        addBoardAction: (
            state: IBoardsState,
            action: PayloadAction<IBoard>
        ) => {
            state[action.payload.itemId] = action.payload;
            return state;
        },
        resetBoardAction: () => {
            return initialState;
        },
    },
});

export const { addBoardAction, resetBoardAction } = boardsSlice.actions;

export default boardsSlice.reducer;
