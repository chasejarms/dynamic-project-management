import { renderHook, act } from "@testing-library/react-hooks";
import { useBoardColumnEditState } from ".";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "../../../../../../../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { RouteCreator } from "../../../../../../utils/routeCreator";
import { Api } from "../../../../../../../../../api";
import { uncategorizedColumnReservedId } from "../../../../../../../../../constants/reservedColumnIds";
import { IColumn } from "../../../../../../../../../models/column";
import * as boardColumnEditMappedStateModule from "../../../../../../../../../redux/boardColumnEditMappedState";

describe("useBoardColumnEditState", () => {
    let columns: IColumn[] = [];
    beforeEach(() => {
        jest.restoreAllMocks();
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

    describe("the column data is not yet in redux", () => {
        it("should return true for the isLoadingColumns key", async () => {
            jest.spyOn(Api.columns, "getColumns").mockImplementation(() => {
                return Promise.resolve(columns);
            });

            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore();
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

            expect(renderHookResult.result.current.isLoadingColumns).toBe(true);

            await renderHookResult.waitForNextUpdate();

            expect(renderHookResult.result.current.isLoadingColumns).toBe(
                false
            );
        });
    });

    describe("the column data is already in redux", () => {
        it("should not make the api request", () => {
            const getColumnsSpy = jest
                .spyOn(Api.columns, "getColumns")
                .mockImplementation(() => {
                    return Promise.resolve(columns);
                });

            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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

            expect(renderHookResult.result.current.isLoadingColumns).toBe(
                false
            );
            expect(getColumnsSpy.mock.calls.length).toBe(0);
        });
    });

    describe("the columns are not being saved", () => {
        it("should return false for the isSavingColumns field", () => {
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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

            expect(renderHookResult.result.current.isSavingColumns).toBe(false);
        });
    });

    describe("the columns are being saved", () => {
        it("should return true for the isSavingColumns field", async () => {
            jest.spyOn(Api.columns, "updateColumns").mockImplementation(() => {
                return Promise.resolve(columns);
            });

            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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

            expect(renderHookResult.result.current.isSavingColumns).toBe(false);
            act(() => {
                renderHookResult.result.current.saveColumns();
            });
            expect(renderHookResult.result.current.isSavingColumns).toBe(true);
            await renderHookResult.waitForValueToChange(() => {
                return renderHookResult.result.current.isSavingColumns;
            });
            expect(renderHookResult.result.current.isSavingColumns).toBe(false);
        });
    });

    describe("there are two or less columns", () => {
        it("should return true for the disableDeleteButton key", () => {
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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

            expect(renderHookResult.result.current.disableDeleteButton).toBe(
                true
            );
        });
    });

    describe("there are at least three columns", () => {
        it("should return false for the disableDeleteButton key", () => {
            columns.push({
                id: "2",
                name: "Deployed to Production",
                canBeModified: true,
            });
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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

            expect(renderHookResult.result.current.disableDeleteButton).toBe(
                false
            );
        });
    });

    describe("one of the local controls is in an error state", () => {
        it("should return true for the isInErrorState key", () => {
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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
                                                nameError: "Error",
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

            expect(renderHookResult.result.current.isInErrorState).toBe(true);
        });
    });

    describe("none of the local controls are in an error state", () => {
        it("should return false for the isInErrorState key", () => {
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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

            expect(renderHookResult.result.current.isInErrorState).toBe(false);
        });
    });

    describe("the column data has changed", () => {
        it("should return true for the columnDataHasChanged key", () => {
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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
                                                name: "Other",
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

            expect(renderHookResult.result.current.columnDataHasChanged).toBe(
                true
            );
        });
    });

    describe("the column data has NOT changed", () => {
        it("should return false for the columnDataHasChanged key", () => {
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
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

            expect(renderHookResult.result.current.columnDataHasChanged).toBe(
                false
            );
        });
    });

    describe("the on drag end function is invoked", () => {
        describe("the destination is falsy", () => {
            it("should short circuit", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useBoardColumnEditState();
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

                const actionCreatorSpy = jest.spyOn(
                    boardColumnEditMappedStateModule,
                    "updateBoardColumnPosition"
                );
                renderHookResult.result.current.onDragEnd({
                    destination: undefined,
                    source: {
                        index: 1,
                    },
                } as any);
                expect(actionCreatorSpy.mock.calls.length).toBe(0);
            });
        });

        describe("the destination is truthy", () => {
            it("should dispatch the action", () => {
                columns.push({
                    id: "2",
                    name: "Deployed to Production",
                    canBeModified: true,
                });

                const renderHookResult = renderHook(
                    () => {
                        return useBoardColumnEditState();
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
                    renderHookResult.result.current.onDragEnd({
                        destination: {
                            index: 2,
                        },
                        source: {
                            index: 1,
                        },
                    } as any);
                });
                expect(
                    renderHookResult.result.current.localColumnControls[2].name
                ).toBe(columns[1].name);
            });
        });
    });
});
