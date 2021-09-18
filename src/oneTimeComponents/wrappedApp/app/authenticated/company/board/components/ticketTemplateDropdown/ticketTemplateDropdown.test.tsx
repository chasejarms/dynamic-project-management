import { render, screen } from "@testing-library/react";
import { ITicketTemplateDropdownProps, TicketTemplateDropdown } from ".";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { ticketTemplateDropdownTestsIds } from "./ticketTemplateDropdown.testIds";
import userEvent from "@testing-library/user-event";
import { RouteCreator } from "../../../../../utils/routeCreator";

describe("TicketTemplateDropdown", () => {
    let ticketTemplates: ITicketTemplate[];
    let ticketTemplateDropdownProps: ITicketTemplateDropdownProps;

    beforeEach(() => {
        ticketTemplates = [
            {
                shortenedItemId: "1",
                name: "First Ticket Template",
            } as any,
            {
                shortenedItemId: "2",
                name: "Second Ticket Template",
            } as any,
        ];

        ticketTemplateDropdownProps = {
            ticketTemplate: ticketTemplates[0],
            ticketTemplates,
            onChangeTicketTemplate: () => null,
            disabled: false,
            showOpenIcon: true,
        };
    });

    describe("the disabled prop is true", () => {
        it("should disable the dropdown", () => {
            ticketTemplateDropdownProps.disabled = true;

            const history = createMemoryHistory();
            history.push(`/app/company/123/board/456/`);
            render(
                <Router history={history}>
                    <TicketTemplateDropdown {...ticketTemplateDropdownProps} />
                </Router>
            );

            const select = screen.getByTestId(
                ticketTemplateDropdownTestsIds.select
            );
            expect(select).toHaveClass("Mui-disabled");
        });
    });

    describe("the disabled prop is false", () => {
        it("should enable the dropdown", () => {
            ticketTemplateDropdownProps.disabled = false;

            const history = createMemoryHistory();
            history.push(`/app/company/123/board/456/`);
            render(
                <Router history={history}>
                    <TicketTemplateDropdown {...ticketTemplateDropdownProps} />
                </Router>
            );

            const select = screen.getByTestId(
                ticketTemplateDropdownTestsIds.select
            );
            expect(select).not.toHaveClass("Mui-disabled");
        });
    });

    describe("the showOpenIcon prop is true", () => {
        beforeEach(() => {
            ticketTemplateDropdownProps.showOpenIcon = true;
        });

        describe("the ticket template is NOT null", () => {
            beforeEach(() => {
                ticketTemplateDropdownProps.ticketTemplate = ticketTemplates[0];
            });

            it("should show the open icon", () => {
                const history = createMemoryHistory();
                history.push(`/app/company/123/board/456/`);
                render(
                    <Router history={history}>
                        <TicketTemplateDropdown
                            {...ticketTemplateDropdownProps}
                        />
                    </Router>
                );

                screen.getByTestId(ticketTemplateDropdownTestsIds.openIcon);
            });

            describe("the user clicks the open icon", () => {
                it("should navigate to the correct page in a new tab", () => {
                    const history = createMemoryHistory();
                    history.push(`/app/company/123/board/456/`);
                    render(
                        <Router history={history}>
                            <TicketTemplateDropdown
                                {...ticketTemplateDropdownProps}
                            />
                        </Router>
                    );

                    const openIcon = screen.getByTestId(
                        ticketTemplateDropdownTestsIds.openIcon
                    );
                    const windowSpy = jest
                        .spyOn(window, "open")
                        .mockImplementation(() => null);
                    userEvent.click(openIcon);
                    const ticketTemplateEditRoute = RouteCreator.ticketTemplateEdit(
                        "123",
                        "456",
                        ticketTemplates[0].shortenedItemId
                    );
                    expect(windowSpy.mock.calls[0][0]).toBe(
                        ticketTemplateEditRoute
                    );
                    expect(windowSpy.mock.calls[0][1]).toBe("_blank");
                });
            });

            it("should show the open icon", () => {});
        });

        describe("the ticket template is null", () => {
            it("should disable the open icon", () => {});

            it("should show the open icon", () => {});
        });
    });

    describe("the showOpenIcon prop is false", () => {
        it("should hide the open icon", () => {});
    });

    describe("a ticket template is provided", () => {
        it("should show that ticket template in the dropdown by default", () => {});
    });

    describe("the user clicks on the dropdown", () => {
        it("should list all of the ticket templates", () => {});
    });

    describe("a user clicks a different ticket template from the dropdown", () => {
        it("should call on change with the selected ticket template", () => {});
    });
});
