import { isEqual } from "lodash";
import boardColumnEditMappedStateReducer, {
    IBoardColumnEditMappedState,
    setInitialBoardColumnState,
    updateBoardColumnPosition,
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
                expect(isEqual(databaseColumns[index], column));
                expect(
                    isEqual(localColumnControls[index], {
                        ...column,
                        nameError: "",
                    })
                );
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
            ].localColumnControls[0];
            expect(isEqual(columnAtIndexOne, columns[0]));
        });
    });
});
