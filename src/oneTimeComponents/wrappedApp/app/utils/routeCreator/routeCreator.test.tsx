import { RouteCreator } from ".";

describe("routeCreator", () => {
    describe("ticketTemplateEdit", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.ticketTemplateEdit("1", "2", "3");
            expect(route).toBe("/app/company/1/board/2/ticket-templates/3");
        });
    });

    describe("ticketTemplates", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.ticketTemplates("1", "2");
            expect(route).toBe("/app/company/1/board/2/ticket-templates");
        });
    });

    describe("createTicketTemplate", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.createTicketTemplate("1", "2");
            expect(route).toBe(
                "/app/company/1/board/2/ticket-templates/create-ticket-template"
            );
        });
    });

    describe("boards", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.boards("1");
            expect(route).toBe("/app/company/1/boards");
        });
    });

    describe("boardAdmins", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.boardAdmins("1", "2");
            expect(route).toBe("/app/company/1/board/2/board-admins");
        });
    });

    describe("archivedTickets", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.archivedTickets("1", "2");
            expect(route).toBe("/app/company/1/board/2/archived-tickets");
        });
    });

    describe("inProgressTickets", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.inProgressTickets("1", "2");
            expect(route).toBe("/app/company/1/board/2/tickets");
        });
    });

    describe("createTicket", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.createTicket("1", "2");
            expect(route).toBe("/app/company/1/board/2/tickets/create-ticket");
        });
    });

    describe("editBoard", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.editBoard("1", "2");
            expect(route).toBe("/app/company/1/board/2/edit-board");
        });
    });

    describe("backlogTickets", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.backlogTickets("1", "2");
            expect(route).toBe("/app/company/1/board/2/backlog-tickets");
        });
    });

    describe("inProgressTicketData", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.inProgressTicketData("1", "2", "3");
            expect(route).toBe("/app/company/1/board/2/tickets/3/data");
        });
    });

    describe("backlogTicketData", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.backlogTicketData("1", "2", "3");
            expect(route).toBe("/app/company/1/board/2/backlog-tickets/3/data");
        });
    });

    describe("archivedTicketData", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.archivedTicketData("1", "2", "3");
            expect(route).toBe(
                "/app/company/1/board/2/archived-tickets/3/data"
            );
        });
    });

    describe("inProgressTicketImages", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.inProgressTicketImages("1", "2", "3");
            expect(route).toBe("/app/company/1/board/2/tickets/3/images");
        });
    });

    describe("backlogTicketImages", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.backlogTicketImages("1", "2", "3");
            expect(route).toBe(
                "/app/company/1/board/2/backlog-tickets/3/images"
            );
        });
    });

    describe("archivedTicketImages", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.archivedTicketImages("1", "2", "3");
            expect(route).toBe(
                "/app/company/1/board/2/archived-tickets/3/images"
            );
        });
    });

    describe("createBoard", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.createBoard("1");
            expect(route).toBe("/app/company/1/boards/create-board");
        });
    });

    describe("companyUsers", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.companyUsers("1");
            expect(route).toBe("/app/company/1/company-users");
        });
    });

    describe("addCompany", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.addCompany("1");
            expect(route).toBe("/app/company/1/add-company");
        });
    });

    describe("companies", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.companies();
            expect(route).toBe("/app/companies");
        });
    });

    describe("learningCenterEditor", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.learningCenterEditor();
            expect(route).toBe("/app/internal/learning-center-editor");
        });
    });

    describe("learningCenterVideos", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.learningCenterVideos();
            expect(route).toBe("/app/internal/learning-center-videos");
        });
    });

    describe("contact", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.contact();
            expect(route).toBe("/contact");
        });
    });

    describe("signIn", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.signIn();
            expect(route).toBe("/sign-in");
        });
    });

    describe("signUp", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.signUp();
            expect(route).toBe("/sign-up");
        });
    });

    describe("resetPassword", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.resetPassword();
            expect(route).toBe("/reset-password");
        });
    });

    describe("enterNewPassword", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.enterNewPassword();
            expect(route).toBe("/enter-new-password");
        });
    });

    describe("app", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.app();
            expect(route).toBe("/app");
        });
    });

    describe("home", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.home();
            expect(route).toBe("/");
        });
    });
});
