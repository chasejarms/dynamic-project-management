import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IColumn } from "../../models/column";
import { cloneDeep } from "lodash";
import { generateUniqueId } from "../../oneTimeComponents/wrappedApp/app/authenticated/company/board/boardEdit/hooks/utils/generateUniqueId";
import { StringValidator } from "../../classes/StringValidator";

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
        addColumnAfter(
            state: IBoardColumnEditMappedState,
            action: PayloadAction<{
                boardId: string;
                index: number;
            }>
        ) {
            const clonedState = cloneDeep(state);
            const { boardId, index } = action.payload;
            const columnsBeforeUpdate =
                clonedState[boardId].localColumnControls;

            const columnsBeforeInsertedColumn = columnsBeforeUpdate.slice(
                0,
                index + 1
            );
            const columnsAfterInsertedColumn = columnsBeforeUpdate.slice(
                index + 1
            );
            const updatedLocalColumnControls = columnsBeforeInsertedColumn
                .concat([
                    {
                        id: generateUniqueId(),
                        name: "Default (Newly Added)",
                        canBeModified: true,
                        labelError: "",
                    },
                ])
                .concat(columnsAfterInsertedColumn);

            clonedState[
                boardId
            ].localColumnControls = updatedLocalColumnControls;
            return clonedState;
        },
        updateLocalColumnControl: (
            state: IBoardColumnEditMappedState,
            action: PayloadAction<{
                boardId: string;
                index: number;
                updatedValue: string;
            }>
        ) => {
            const clonedState = cloneDeep(state);
            const { boardId, index, updatedValue } = action.payload;
            const columnsBeforeUpdate =
                clonedState[boardId].localColumnControls;
            columnsBeforeUpdate[index] = {
                ...columnsBeforeUpdate[index],
                name: updatedValue,
                labelError: new StringValidator()
                    .required("This field is required")
                    .validate(updatedValue),
            };

            return clonedState;
        },
    },
});

export const {
    setInitialBoardColumnState,
    updateBoardColumnPosition,
    resetLocalColumnControlChanges,
    deleteColumn,
    addColumnAfter,
    updateLocalColumnControl,
} = boardColumnEditMappedSlice.actions;

export default boardColumnEditMappedSlice.reducer;
