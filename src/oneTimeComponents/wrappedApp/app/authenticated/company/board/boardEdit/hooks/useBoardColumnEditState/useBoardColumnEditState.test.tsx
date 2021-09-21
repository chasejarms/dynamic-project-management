import { renderHook } from "@testing-library/react-hooks";
import { useBoardColumnEditState } from ".";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "../../../../../../../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { RouteCreator } from "../../../../../../utils/routeCreator";
import { Api } from "../../../../../../../../../api";
import { uncategorizedColumnReservedId } from "../../../../../../../../../constants/reservedColumnIds";

describe("useBoardColumnEditState", () => {
    describe("the column data is not yet in redux", () => {
        it("should return true for the isLoadingColumns key", async () => {
            jest.spyOn(Api.columns, "getColumns").mockImplementation(() => {
                return Promise.resolve([
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
                ]);
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
                    return Promise.resolve([
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
                    ]);
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

            expect(renderHookResult.result.current.isLoadingColumns).toBe(
                false
            );
            expect(getColumnsSpy.mock.calls.length).toBe(0);
        });
    });
});
