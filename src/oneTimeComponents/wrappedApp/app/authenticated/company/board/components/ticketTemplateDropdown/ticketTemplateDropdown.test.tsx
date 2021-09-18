import { render, screen } from "@testing-library/react";
import { ITicketTemplateDropdownProps, TicketTemplateDropdown } from ".";
import { ITicketTemplate } from "../../../../../../../../models/ticketTemplate";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

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

            const select = screen.getByTestId("testing-this-thing");
            expect(select).toHaveClass("Mui-disabled");
        });
    });

    describe("the disabled prop is false", () => {
        it("should enable the dropdown", () => {});
    });

    describe("the showOpenIcon prop is true", () => {
        describe("the ticket template is NOT null", () => {
            it("should show the open icon", () => {});

            describe("the user clicks the open icon", () => {
                it("should navigate to the correct page in a new tab", () => {});
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
