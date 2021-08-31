import { useLocation } from "react-router-dom";

export function useAppRouterParams() {
    const location = useLocation();

    const routeSplitBySlashes = location.pathname.split("/");

    let companyId = "";
    let boardId = "";
    let ticketId = "";
    let ticketTemplateId = "";

    routeSplitBySlashes.forEach((routeFragment, index) => {
        const nextRouteFragment = routeSplitBySlashes[index + 1];
        if (routeFragment === "company") {
            companyId = nextRouteFragment;
        } else if (
            routeFragment === "tags-board" ||
            routeFragment === "board-router" ||
            routeFragment == "weighted-board"
        ) {
            boardId = nextRouteFragment;
        } else if (routeFragment === "ticket") {
            ticketId = nextRouteFragment;
        } else if (routeFragment === "ticket-templates") {
            ticketTemplateId = nextRouteFragment;
        }
    });

    return {
        companyId,
        boardId,
        ticketId,
        ticketTemplateId,
    };
}
