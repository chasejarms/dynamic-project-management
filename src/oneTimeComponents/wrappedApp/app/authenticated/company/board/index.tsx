import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForBoardAccess } from "./hooks/useIsCheckingForBoardAccess";
import { BacklogTickets } from "./backlogTickets";
import { BoardHome } from "./boardHome";
import { ArchivedTickets } from "./archivedTickets";
import { BoardEdit } from "./boardEdit";
import { BoardUsers } from "./boardUsers";
import { TicketTemplates } from "./ticketTemplates";

export function Board() {
    const { url } = useRouteMatch();
    const isCheckingForBoardAccess = useIsCheckingForBoardAccess();

    return isCheckingForBoardAccess ? null : (
        <Switch>
            <Route path={`${url}/tickets`}>
                <BoardHome />
            </Route>
            <Route path={`${url}/edit-board`} exact>
                <BoardEdit />
            </Route>
            <Route path={`${url}/backlog-tickets`}>
                <BacklogTickets />
            </Route>
            <Route path={`${url}/archived-tickets`}>
                <ArchivedTickets />
            </Route>
            <Route path={`${url}/board-admins`} exact>
                <BoardUsers />
            </Route>
            <Route path={`${url}/ticket-templates`}>
                <TicketTemplates />
            </Route>
        </Switch>
    );
}
