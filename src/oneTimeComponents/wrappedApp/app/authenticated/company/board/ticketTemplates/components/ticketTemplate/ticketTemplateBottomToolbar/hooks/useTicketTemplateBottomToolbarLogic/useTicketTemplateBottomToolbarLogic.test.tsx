import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import {
    ITicketTemplateBottomToolbarLogicProps,
    useTicketTemplateBottomToolbarLogic,
} from ".";
import { RouteCreator } from "../../../../../../../../../utils/routeCreator";
import * as useTicketTemplateControlsAreValidModule from "./hooks/useTicketTemplateControlsAreValid";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "../../../../../../../../../../../../redux/store";
import { createTicketTemplateId } from "../../../../../../../../../../../../redux/ticketTemplates";

describe("useTicketTemplateBottomToolbarLogic", () => {
    let props: ITicketTemplateBottomToolbarLogicProps;
    beforeEach(() => {
        props = {
            onClickActionButton: () => null,
            actionButtonText: "Create",
            showActionButtonSpinner: false,
            ticketTemplateId: "123",
        };

        jest.spyOn(
            useTicketTemplateControlsAreValidModule,
            "useTicketTemplateControlsAreValid"
        ).mockImplementation(() => {
            return true;
        });
    });

    describe("the useTicketTemplateControlsAreValid hook returns true", () => {
        beforeEach(() => {
            jest.spyOn(
                useTicketTemplateControlsAreValidModule,
                "useTicketTemplateControlsAreValid"
            ).mockImplementation(() => {
                return true;
            });
        });

        describe("the showActionButtonSpinner prop is true", () => {
            beforeEach(() => {
                props.showActionButtonSpinner = true;
            });

            it("should disable the right action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.createTicketTemplate(
                                            "123",
                                            "456"
                                        ),
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

                expect(
                    renderHookResult.result.current.rightWrappedButtonProps[0]
                        .disabled
                ).toBe(true);
            });

            it("should disable the left action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.ticketTemplateEdit(
                                            "123",
                                            "456",
                                            "123"
                                        ),
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

                expect(
                    renderHookResult.result.current.leftWrappedButtonProps[0]
                        .disabled
                ).toBe(true);
            });
        });

        describe("the showActionButtonSpinner prop is false", () => {
            beforeEach(() => {
                props.showActionButtonSpinner = false;
            });

            it("should enable the right action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.createTicketTemplate(
                                            "123",
                                            "456"
                                        ),
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

                expect(
                    renderHookResult.result.current.rightWrappedButtonProps[0]
                        .disabled
                ).toBe(false);
            });

            it("should enable the left action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.ticketTemplateEdit(
                                            "123",
                                            "456",
                                            "123"
                                        ),
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

                expect(
                    renderHookResult.result.current.leftWrappedButtonProps[0]
                        .disabled
                ).toBe(false);
            });
        });
    });

    describe("the useTicketTemplateControlsAreValid hook returns false", () => {
        beforeEach(() => {
            jest.spyOn(
                useTicketTemplateControlsAreValidModule,
                "useTicketTemplateControlsAreValid"
            ).mockImplementation(() => {
                return false;
            });
        });

        describe("the showActionButtonSpinner prop is true", () => {
            beforeEach(() => {
                props.showActionButtonSpinner = true;
            });

            it("should disable the right action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.createTicketTemplate(
                                            "123",
                                            "456"
                                        ),
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

                expect(
                    renderHookResult.result.current.rightWrappedButtonProps[0]
                        .disabled
                ).toBe(true);
            });

            it("should disable the left action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.ticketTemplateEdit(
                                            "123",
                                            "456",
                                            "123"
                                        ),
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

                expect(
                    renderHookResult.result.current.leftWrappedButtonProps[0]
                        .disabled
                ).toBe(true);
            });
        });

        describe("the showActionButtonSpinner prop is false", () => {
            beforeEach(() => {
                props.showActionButtonSpinner = false;
            });

            it("should disable the right action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.createTicketTemplate(
                                            "123",
                                            "456"
                                        ),
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

                expect(
                    renderHookResult.result.current.rightWrappedButtonProps[0]
                        .disabled
                ).toBe(true);
            });

            it("should disable the left action button", () => {
                const renderHookResult = renderHook(
                    () => {
                        return useTicketTemplateBottomToolbarLogic(props);
                    },
                    {
                        wrapper: ({ children }) => {
                            const store = createStore();
                            return (
                                <MemoryRouter
                                    initialEntries={[
                                        RouteCreator.ticketTemplateEdit(
                                            "123",
                                            "456",
                                            "123"
                                        ),
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

                expect(
                    renderHookResult.result.current.leftWrappedButtonProps[0]
                        .disabled
                ).toBe(true);
            });
        });
    });

    describe("ticket template id is equal to the createTicketTemplateId", () => {
        it("should hide the copy button", () => {
            props.ticketTemplateId = createTicketTemplateId;

            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore();
                        return (
                            <MemoryRouter
                                initialEntries={[
                                    RouteCreator.ticketTemplateEdit(
                                        "123",
                                        "456",
                                        "123"
                                    ),
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

            expect(
                renderHookResult.result.current.leftWrappedButtonProps.length
            ).toBe(0);
        });
    });

    describe("ticket template id is NOT equal to the createTicketTemplateId", () => {
        it("should show the copy button", () => {
            props.ticketTemplateId = "2334";

            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore();
                        return (
                            <MemoryRouter
                                initialEntries={[
                                    RouteCreator.ticketTemplateEdit(
                                        "123",
                                        "456",
                                        "123"
                                    ),
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

            expect(
                renderHookResult.result.current.leftWrappedButtonProps.length
            ).toBe(1);
        });
    });

    it("should show the correct action button text", () => {
        props.actionButtonText = "Action Button Text";

        const renderHookResult = renderHook(
            () => {
                return useTicketTemplateBottomToolbarLogic(props);
            },
            {
                wrapper: ({ children }) => {
                    const store = createStore();
                    return (
                        <MemoryRouter
                            initialEntries={[
                                RouteCreator.ticketTemplateEdit(
                                    "123",
                                    "456",
                                    "123"
                                ),
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

        expect(
            renderHookResult.result.current.rightWrappedButtonProps[0].children
        ).toBe("Action Button Text");
    });

    describe("the user clicks the copy template button", () => {
        it("should dispatch the correct action and navigate to the correct route", () => {
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore();
                        return (
                            <MemoryRouter
                                initialEntries={[
                                    RouteCreator.ticketTemplateEdit(
                                        "123",
                                        "456",
                                        "123"
                                    ),
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

            const onClickCopy = renderHookResult.result.current
                .rightWrappedButtonProps[0].onClick!;
            onClickCopy({} as any);
        });
    });
});
