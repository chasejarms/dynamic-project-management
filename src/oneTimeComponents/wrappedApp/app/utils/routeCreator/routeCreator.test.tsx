import { RouteCreator } from ".";

describe("routeCreator", () => {
    describe("ticketTemplateEdit", () => {
        it("should create the correct route", () => {
            const route = RouteCreator.ticketTemplateEdit("1", "2", "3");
            expect(route).toBe(`/app/company/1/board/2/ticket-templates/3`);
        });
    });
});
