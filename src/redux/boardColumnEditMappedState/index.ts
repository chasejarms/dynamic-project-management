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
        updateBoardColumnPosition: (
            state: IBoardColumnEditMappedState,
            action: PayloadAction<{
                boardId: string;
                previousIndex: number;
                updatedIndex: number;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            const { boardId, previousIndex, updatedIndex } = action.payload;
            const columnsBeforeUpdate =
                clonedState[boardId].localColumnControls;

            const columnToMove = columnsBeforeUpdate[previousIndex];

            const arrayBeforeItem = columnsBeforeUpdate.slice(0, previousIndex);
            const arrayAfterItem = columnsBeforeUpdate.slice(previousIndex + 1);
            const arrayWithItemRemoved = arrayBeforeItem.concat(arrayAfterItem);

            const updatedDestinationIndex =
                updatedIndex === 0 ? 1 : updatedIndex;

            const arrayBeforeInsertedIndex = arrayWithItemRemoved.slice(
                0,
                updatedDestinationIndex
            );
            const arrayAfterInsertedIndex = arrayWithItemRemoved.slice(
                updatedDestinationIndex
            );
            const updatedLocalColumnControls = arrayBeforeInsertedIndex
                .concat([columnToMove])
                .concat(arrayAfterInsertedIndex);

            clonedState[
                boardId
            ].localColumnControls = updatedLocalColumnControls;
            return clonedState;
        },
        resetLocalColumnControlChanges: (
            state: IBoardColumnEditMappedState,
            action: PayloadAction<{
                boardId: string;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            const { boardId } = action.payload;
            const databaseColumns = clonedState[boardId].databaseColumns;

            const updatedLocalColumnControls = databaseColumns.map((column) => {
                return {
                    ...column,
                    labelError: "",
                };
            });

            clonedState[
                boardId
            ].localColumnControls = updatedLocalColumnControls;
            return clonedState;
        },
        deleteColumn: (
            state: IBoardColumnEditMappedState,
            action: PayloadAction<{
                boardId: string;
                index: number;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            const { boardId, index } = action.payload;
            const columnsBeforeUpdate =
                clonedState[boardId].localColumnControls;

            const updatedLocalColumnControls = columnsBeforeUpdate.filter(
                (unused, compareIndex) => {
                    return compareIndex !== index;
                }
            );

            clonedState[
                boardId
            ].localColumnControls = updatedLocalColumnControls;
            return clonedState;
        },
    },
});

export const {
    setInitialBoardColumnState,
    updateBoardColumnPosition,
    resetLocalColumnControlChanges,
    deleteColumn,
} = boardColumnEditMappedSlice.actions;

export default boardColumnEditMappedSlice.reducer;
