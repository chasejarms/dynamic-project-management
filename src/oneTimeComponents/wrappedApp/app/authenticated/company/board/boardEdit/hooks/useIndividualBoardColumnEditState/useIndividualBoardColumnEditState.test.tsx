import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { useIndividualBoardColumnEditState } from ".";
import { RouteCreator } from "../../../../../../utils/routeCreator";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "../../../../../../../../../redux/store";
import { uncategorizedColumnReservedId } from "../../../../../../../../../constants/reservedColumnIds";
import { IColumn } from "../../../../../../../../../models/column";

describe("useIndividualBoardColumnEditState", () => {
    let columns: IColumn[] = [];
    beforeEach(() => {
        columns = [
            {
                id: uncategorizedColumnReservedId,
                canBeModified: false,
                name: "Uncategorized",
            },
            {
                id: "1",
                canBeModified: true,
                name: "To Do",
            },
        ];
    });

    it("should return the correct individual control information", () => {
        const renderHookResult = renderHook(
            () => {
                return useIndividualBoardColumnEditState(0);
            },
            {
                wrapper: ({ children }) => {
                    const boardId = "456";
                    const store = createStore({
                        boardColumnEditMappedState: {
                            [boardId]: {
                                databaseColumns: columns,
                                localColumnControls: columns.map((column) => {
                                    return {
                                        ...column,
                                        nameError: "",
                                    };
                                }),
                            },
                        },
                    });
                    return (
                        <MemoryRouter
                            initialEntries={[
                                RouteCreator.editBoard("123", "456"),
                            ]}
                        >
                            <ReduxProvider store={store}>
                                {children}
                            </ReduxProvider>
                        </MemoryRouter>
                    );
                },
            }
        );

        expect(renderHookResult.result.current.canBeModified).toBe(
            columns[0].canBeModified
        );
        expect(renderHookResult.result.current.id).toBe(columns[0].id);
        expect(renderHookResult.result.current.name).toBe(columns[0].name);
        expect(renderHookResult.result.current.nameError).toBe("");
    });
});
