import {
    ITicketTemplateBottomToolbarLogicProps,
    useTicketTemplateBottomToolbarLogic,
} from ".";
import { renderHook } from "@testing-library/react-hooks";
import { createStore } from "../../../../../../../../../../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { RouteCreator } from "../../../../../../../../../utils/routeCreator";
import {
    createTicketTemplateId,
    ITicketTemplateControlState,
    ITicketTemplateNumberSectionControlState,
    ITicketTemplateTextSectionControlState,
} from "../../../../../../../../../../../../redux/ticketTemplates";

describe("useTicketTemplateBottomToolbarLogic", () => {
    let props: ITicketTemplateBottomToolbarLogicProps;
    let ticketTemplateControlState: ITicketTemplateControlState;

    beforeEach(() => {
        props = {
            onClickActionButton: () => null,
            actionButtonText: "Create",
            showActionButtonSpinner: false,
            ticketTemplateId: "",
        };

        ticketTemplateControlState = {
            name: {
                value: "",
                touched: false,
                error: "",
            },
            description: {
                value: "",
                touched: false,
                error: "",
            },
            title: {
                value: "Title",
                touched: false,
                error: "",
            },
            summary: {
                value: "Summary",
                touched: false,
                error: "",
            },
            sections: [
                {
                    value: {
                        type: "text",
                        label: "Text Label",
                        multiline: false,
                        required: false,
                    },
                    error: "",
                },
                {
                    value: {
                        type: "number",
                        label: "Number Section",
                        required: false,
                        allowOnlyIntegers: false,
                        alias: "",
                    },
                    labelError: "",
                    minError: "",
                    maxError: "",
                    aliasError: "",
                },
            ],
            priorityWeightingCalculation: {
                value: "",
                error: "",
            },
        };
    });

    describe("all controls are valid", () => {
        it("should enable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the name is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            ticketTemplateControlState.name.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the description is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            ticketTemplateControlState.description.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the title is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            ticketTemplateControlState.title.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the summary is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            ticketTemplateControlState.summary.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the text section is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            (ticketTemplateControlState
                .sections[0] as ITicketTemplateTextSectionControlState).error =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the number section has a label error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).labelError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the number section has a min error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).minError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the number section has a max error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).maxError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the number section has an alias error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).aliasError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the controls are valid and the show action button spinner props is true", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            props.ticketTemplateId = ticketTemplateId;
            props.showActionButtonSpinner = true;
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
    });

    describe("the ticket template id is the create ticket template id", () => {
        it("should hide the copy button", () => {
            props.ticketTemplateId = createTicketTemplateId;
            props.showActionButtonSpinner = true;
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [createTicketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
                renderHookResult.result.current.leftWrappedButtonProps.length
            ).toBe(0);
        });
    });

    describe("the ticket template id is NOT the create ticket template id", () => {
        it("should show the copy button", () => {
            const ticketTemplateId = "678";
            props.ticketTemplateId = ticketTemplateId;
            props.showActionButtonSpinner = true;
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateBottomToolbarLogic(props);
                },
                {
                    wrapper: ({ children }) => {
                        const store = createStore({
                            weightedTicketTemplateCreation: {
                                [ticketTemplateId]: ticketTemplateControlState,
                            },
                        });
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
                renderHookResult.result.current.leftWrappedButtonProps.length
            ).toBe(1);
        });
    });
});
