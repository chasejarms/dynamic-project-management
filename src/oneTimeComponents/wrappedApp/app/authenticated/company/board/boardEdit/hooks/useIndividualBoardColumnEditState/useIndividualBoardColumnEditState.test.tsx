import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { useIndividualBoardColumnEditState } from ".";
import { RouteCreator } from "../../../../../../utils/routeCreator";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "../../../../../../../../../redux/store";
import { uncategorizedColumnReservedId } from "../../../../../../../../../constants/reservedColumnIds";
import { IColumn } from "../../../../../../../../../models/column";
import { defaultNewColumnName } from "../../../../../../../../../redux/boardColumnEditMappedState";

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

    describe("onDeleteColumn is invoked", () => {
        it("should correctly delete the column", () => {
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
                                    localColumnControls: columns.map(
                                        (column) => {
                                            return {
                                                ...column,
                                                nameError: "",
                                            };
                                        }
                                    ),
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

            act(() => {
                renderHookResult.result.current.onDeleteColumn(0)();
            });
            expect(renderHookResult.result.current.name).toBe(columns[1].name);
        });
    });

    describe("onUpdateColumn is invoked", () => {
        it("should correctly update the column", () => {
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
                                    localColumnControls: columns.map(
                                        (column) => {
                                            return {
                                                ...column,
                                                nameError: "",
                                            };
                                        }
                                    ),
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

            const newName = "New Name";
            act(() => {
                renderHookResult.result.current.onUpdateColumn(0)({
                    target: {
                        value: newName,
                    },
                } as any);
            });
            expect(renderHookResult.result.current.name).toBe(newName);
        });
    });

    describe("onClickAddAfter is invoked", () => {
        it("should add another column to the list", () => {
            const renderHookResult = renderHook(
                () => {
                    return useIndividualBoardColumnEditState(1);
                },
                {
                    wrapper: ({ children }) => {
                        const boardId = "456";
                        const store = createStore({
                            boardColumnEditMappedState: {
                                [boardId]: {
                                    databaseColumns: columns,
                                    localColumnControls: columns.map(
                                        (column) => {
                                            return {
                                                ...column,
                                                nameError: "",
                                            };
                                        }
                                    ),
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

            act(() => {
                renderHookResult.result.current.onClickAddAfter(0)();
            });
            expect(renderHookResult.result.current.name).toBe(
                defaultNewColumnName
            );
        });
    });
});
