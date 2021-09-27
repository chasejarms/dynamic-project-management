import { useTicketTemplateControlsAreValid } from ".";
import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import {
    ITicketTemplateControlState,
    ITicketTemplateNumberSectionControlState,
    ITicketTemplateTextSectionControlState,
} from "../../../../../../../../../../../../../../redux/ticketTemplates";
import { createStore } from "../../../../../../../../../../../../../../redux/store";
import { RouteCreator } from "../../../../../../../../../../../utils/routeCreator";

describe("useTicketTemplateControlsAreValid", () => {
    let ticketTemplateControlState: ITicketTemplateControlState;

    beforeEach(() => {
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
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(true);
        });
    });

    describe("the name is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            ticketTemplateControlState.name.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the description is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            ticketTemplateControlState.description.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the title is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            ticketTemplateControlState.title.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the summary is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            ticketTemplateControlState.summary.error = "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the text section is not valid but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            (ticketTemplateControlState
                .sections[0] as ITicketTemplateTextSectionControlState).error =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the number section has a label error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).labelError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the number section has a min error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).minError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the number section has a max error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).maxError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });

    describe("the number section has an alias error but all other controls are valid", () => {
        it("should disable the right action button", () => {
            const ticketTemplateId = "567";
            (ticketTemplateControlState
                .sections[1] as ITicketTemplateNumberSectionControlState).aliasError =
                "Invalid";
            const renderHookResult = renderHook(
                () => {
                    return useTicketTemplateControlsAreValid(ticketTemplateId);
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
            expect(renderHookResult.result.current).toBe(false);
        });
    });
});
