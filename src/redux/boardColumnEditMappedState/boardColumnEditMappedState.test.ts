import { isEqual } from "lodash";
import boardColumnEditMappedStateReducer, {
    addColumnAfter,
    boardColumnEditNameRequiredError,
    defaultNewColumnName,
    deleteColumn,
    IBoardColumnEditMappedState,
    resetLocalColumnControlChanges,
    setInitialBoardColumnState,
    updateBoardColumnPosition,
    updateLocalColumnControl,
} from ".";
import { IColumn } from "../../models/column";

describe("boardColumnEditMappedState", () => {
    const boardId = "1";
    let boardColumnEditMappedState: IBoardColumnEditMappedState = {};
    let columns: IColumn[] = [];

    beforeEach(() => {
        columns = [
            {
                id: "1",
                name: "First",
                canBeModified: false,
            },
            {
                id: "2",
                name: "Second",
                canBeModified: false,
            },
        ];

        boardColumnEditMappedState[boardId] = {
            localColumnControls: [
                {
                    ...columns[0],
                    nameError: "",
                },
                {
                    ...columns[1],
                    nameError: "",
                },
            ],
            databaseColumns: [
                {
                    ...columns[0],
                },
                {
                    ...columns[1],
                },
            ],
        };
    });

    it("should be an empty object by default", () => {
        const state = boardColumnEditMappedStateReducer(undefined, {
            type: "Unused",
        });
        expect(Object.keys(state).length).toBe(0);
    });

    describe("setInitialBoardColumnState", () => {
        it("should set the correct initial state", () => {
            const setInitialBoardColumnStateAction = setInitialBoardColumnState(
                {
                    boardId,
                    columns,
                }
            );
            const state = boardColumnEditMappedStateReducer(
                undefined,
                setInitialBoardColumnStateAction
            );
            const { localColumnControls, databaseColumns } = state[boardId];
            columns.forEach((column, index) => {
                expect(isEqual(databaseColumns[index], column)).toBe(true);
                expect(
                    isEqual(localColumnControls[index], {
                        ...column,
                        nameError: "",
                    })
                ).toBe(true);
            });
        });
    });

    describe("updateBoardColumnPosition", () => {
        it("should move the column to the correct position in the localColumnControls array", () => {
            const updateBoardColumnPositionAction = updateBoardColumnPosition({
                boardId: "1",
                previousIndex: 0,
                updatedIndex: 1,
            });
            const state = boardColumnEditMappedStateReducer(
                boardColumnEditMappedState,
                updateBoardColumnPositionAction
            );
            const { nameError, ...columnAtIndexOne } = state[
                boardId
            ].localColumnControls[1];
            expect(isEqual(columnAtIndexOne, columns[0])).toBe(true);
        });
    });

    describe("resetLocalColumnControlChanges", () => {
        it("should reset the localColumnControls state based on the databaseColumns state", () => {
            const resetLocalColumnControlChangesAction = resetLocalColumnControlChanges(
                {
                    boardId: "1",
                }
            );
            boardColumnEditMappedState[boardId].localColumnControls = [
                {
                    ...columns[0],
                    nameError: "This is an error",
                },
            ];
            const state = boardColumnEditMappedStateReducer(
                boardColumnEditMappedState,
                resetLocalColumnControlChangesAction
            );
            const updatedLocalColumnControls =
                state[boardId].localColumnControls;
            expect(updatedLocalColumnControls.length).toBe(2);

            const [
                { nameError: firstColumnNameError, ...firstColumnCompare },
                { nameError: secondColumnNameError, ...secondColumnCompare },
            ] = updatedLocalColumnControls;
            expect(isEqual(firstColumnCompare, columns[0])).toBe(true);
            expect(firstColumnNameError).toBe("");
            expect(isEqual(secondColumnCompare, columns[1])).toBe(true);
            expect(secondColumnNameError).toBe("");
        });
    });

    describe("deleteColumn", () => {
        it("should remove the column from the localColumnControls", () => {
            const deleteColumnAction = deleteColumn({
                boardId: "1",
                index: 0,
            });
            const state = boardColumnEditMappedStateReducer(
                boardColumnEditMappedState,
                deleteColumnAction
            );
            const updatedLocalColumnControls =
                state[boardId].localColumnControls;
            expect(updatedLocalColumnControls.length).toBe(1);

            const {
                nameError,
                ...compareFirstControl
            } = updatedLocalColumnControls[0];
            expect(isEqual(compareFirstControl, columns[1])).toBe(true);
        });
    });

    describe("addColumnAfter", () => {
        it("should add a new column at the correct index", () => {
            const addColumnAfterAction = addColumnAfter({
                boardId: "1",
                index: 0,
            });
            const state = boardColumnEditMappedStateReducer(
                boardColumnEditMappedState,
                addColumnAfterAction
            );
            const updatedLocalColumnControls =
                state[boardId].localColumnControls;
            expect(updatedLocalColumnControls.length).toBe(3);

            expect(updatedLocalColumnControls[1].name).toBe(
                defaultNewColumnName
            );
        });
    });

    describe("addColumnAfter", () => {
        it("should add a new column at the correct index", () => {
            const addColumnAfterAction = addColumnAfter({
                boardId: "1",
                index: 0,
            });
            const state = boardColumnEditMappedStateReducer(
                boardColumnEditMappedState,
                addColumnAfterAction
            );
            const updatedLocalColumnControls =
                state[boardId].localColumnControls;
            expect(updatedLocalColumnControls.length).toBe(3);

            expect(updatedLocalColumnControls[1].name).toBe(
                defaultNewColumnName
            );
        });
    });

    describe("updateLocalColumnControl", () => {
        it("should update the column name value", () => {
            const updateLocalColumnControlAction = updateLocalColumnControl({
                boardId,
                index: 0,
                updatedValue: "hello",
            });
            const state = boardColumnEditMappedStateReducer(
                boardColumnEditMappedState,
                updateLocalColumnControlAction
            );
            const { nameError, name } = state[boardId].localColumnControls[0];
            expect(nameError).toBe("");
            expect(name).toBe("hello");
        });

        describe("the update value is an empty string", () => {
            it("should return a name error", () => {
                const updateLocalColumnControlAction = updateLocalColumnControl(
                    {
                        boardId,
                        index: 0,
                        updatedValue: "",
                    }
                );
                const state = boardColumnEditMappedStateReducer(
                    boardColumnEditMappedState,
                    updateLocalColumnControlAction
                );
                const { nameError } = state[boardId].localColumnControls[0];
                expect(nameError).toBe(boardColumnEditNameRequiredError);
            });
        });
    });
});
