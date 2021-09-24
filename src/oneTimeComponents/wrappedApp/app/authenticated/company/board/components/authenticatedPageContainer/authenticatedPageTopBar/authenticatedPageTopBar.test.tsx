import { render, screen } from "@testing-library/react";
import { AuthenticatedPageTopBar } from ".";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "../../../../../../../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { RouteCreator } from "../../../../../../utils/routeCreator";
import { IAppBootstrapInformationState } from "../../../../../../../../../redux/appBootstrapInformation";
import { createCompanyBoardKey } from "../../../utils/createCompanyBoardKey";

describe("AuthenticatedPageTopBar", () => {
    const companyId = "1";
    const companyName = "First Company";
    const boardId = "abc";
    const boardName = "Development";
    let appBootstrapInformation: IAppBootstrapInformationState;

    beforeEach(() => {
        appBootstrapInformation = {
            companies: [
                {
                    name: companyName,
                    shortenedItemId: companyId,
                    itemId: "",
                    belongsTo: "",
                },
                {
                    name: "Second Company",
                    shortenedItemId: "2",
                    itemId: "",
                    belongsTo: "",
                },
            ],
            internalUser: null,
            isLoading: false,
            users: [],
        };
    });

    describe("breadcrumbs", () => {
        describe("the user belongs to multiple companies", () => {
            it("should show the correct breadcrumb", () => {
                const store = createStore({
                    appBootstrapInformation,
                });

                render(
                    <MemoryRouter initialEntries={[RouteCreator.companies()]}>
                        <ReduxProvider store={store}>
                            <AuthenticatedPageTopBar />
                        </ReduxProvider>
                    </MemoryRouter>
                );

                screen.getByText("Companies");
            });
        });

        describe("the user only has one company", () => {
            it("should NOT show the companies breadcrumb", () => {
                appBootstrapInformation.companies = [
                    appBootstrapInformation.companies[0],
                ];
                const store = createStore({
                    appBootstrapInformation,
                });

                render(
                    <MemoryRouter initialEntries={[RouteCreator.companies()]}>
                        <ReduxProvider store={store}>
                            <AuthenticatedPageTopBar />
                        </ReduxProvider>
                    </MemoryRouter>
                );

                const breadcrumb = screen.queryByText("Companies");
                expect(breadcrumb).toBeNull();
            });
        });

        describe("the companyId is part of the route and the user is part of multiple companies", () => {
            it("should show the boards breadcrumb", () => {
                const store = createStore({
                    appBootstrapInformation,
                });

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.boards(companyId)]}
                    >
                        <ReduxProvider store={store}>
                            <AuthenticatedPageTopBar />
                        </ReduxProvider>
                    </MemoryRouter>
                );

                screen.getByText(`Boards (${companyName})`);
            });
        });

        describe("the companyId is part of the route and the user only belongs to one company", () => {
            it("should show the boards breadcrumb", () => {
                appBootstrapInformation.companies = [
                    appBootstrapInformation.companies[0],
                ];
                const store = createStore({
                    appBootstrapInformation,
                });

                render(
                    <MemoryRouter
                        initialEntries={[RouteCreator.boards(companyId)]}
                    >
                        <ReduxProvider store={store}>
                            <AuthenticatedPageTopBar />
                        </ReduxProvider>
                    </MemoryRouter>
                );

                screen.getByText("Boards");
            });
        });

        describe("the companyId is NOT part of the route", () => {
            it("should NOT show the company breadcrumb", () => {
                const store = createStore({
                    appBootstrapInformation,
                });

                render(
                    <MemoryRouter initialEntries={[RouteCreator.companies()]}>
                        <ReduxProvider store={store}>
                            <AuthenticatedPageTopBar />
                        </ReduxProvider>
                    </MemoryRouter>
                );

                const breadcrumb = screen.queryByText("Boards");
                expect(breadcrumb).toBeNull();
            });
        });

        describe("A board id is in the route", () => {
            describe("The board exists in redux", () => {
                it("should show the correct breadcrumb", () => {
                    const store = createStore({
                        appBootstrapInformation,
                        boards: {
                            [createCompanyBoardKey(companyId, boardId)]: {
                                name: boardName,
                                description: "This is the development board",
                                itemId: "",
                                belongsTo: "",
                                shortenedItemId: boardId,
                            },
                        },
                    });

                    render(
                        <MemoryRouter
                            initialEntries={[
                                RouteCreator.inProgressTickets(
                                    companyId,
                                    boardId
                                ),
                            ]}
                        >
                            <ReduxProvider store={store}>
                                <AuthenticatedPageTopBar />
                            </ReduxProvider>
                        </MemoryRouter>
                    );

                    screen.getByText(`Board (${boardName})`);
                });
            });

            describe("The board does not exist in redux", () => {
                it("should show the correct breadcrumb", () => {
                    const store = createStore({
                        appBootstrapInformation,
                        boards: {},
                    });

                    render(
                        <MemoryRouter
                            initialEntries={[
                                RouteCreator.inProgressTickets(
                                    companyId,
                                    boardId
                                ),
                            ]}
                        >
                            <ReduxProvider store={store}>
                                <AuthenticatedPageTopBar />
                            </ReduxProvider>
                        </MemoryRouter>
                    );

                    screen.getByText("Board");
                });
            });
        });

        describe("A board id is NOT in the route", () => {
            it("should NOT show the board breadcrumb", () => {
                const store = createStore({
                    appBootstrapInformation,
                    boards: {},
                });

                render(
                    <MemoryRouter initialEntries={[RouteCreator.companies()]}>
                        <ReduxProvider store={store}>
                            <AuthenticatedPageTopBar />
                        </ReduxProvider>
                    </MemoryRouter>
                );

                const breadcrumb = screen.queryByText("Board");
                expect(breadcrumb).toBeNull();
            });
        });
    });
});
