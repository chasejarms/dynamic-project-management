import { renderHook } from "@testing-library/react-hooks";
import { useBoardColumnEditState } from ".";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "../../../../../../../../../redux/store";
import { MemoryRouter } from "react-router-dom";

describe("useBoardColumnEditState", () => {
    describe("the column data is not yet in redux", () => {
        it("should return true for the isLoadingColumns key", () => {
            const renderHookResult = renderHook(
                () => {
                    return useBoardColumnEditState();
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore();
                        return (
                            <MemoryRouter
                                initialEntries={["/my/initial/route"]}
                            >
                                <ReduxProvider store={store}>
                                    {children}
                                </ReduxProvider>
                            </MemoryRouter>
                        );
                    },
                }
            );
        });
    });
});
