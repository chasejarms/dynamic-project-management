import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForBoardAccess } from "./hooks/useIsCheckingForBoardAccess";
import { Admin } from "./admin";
import { BacklogTickets } from "./backlogTickets";
import { BoardHome } from "./boardHome";
import { ArchivedTickets } from "./archivedTickets";
import { BoardEdit } from "./boardEdit";

export function Board() {
    const { url } = useRouteMatch();
    const isCheckingForBoardAccess = useIsCheckingForBoardAccess();

    return isCheckingForBoardAccess ? null : (
        <Switch>
            <Route path={`${url}/tickets`}>
                <BoardHome />
            </Route>
            <Route path={`${url}/edit-board`}>
                <BoardEdit />
            </Route>
            <Route path={`${url}/backlog-tickets`}>
                <BacklogTickets />
            </Route>
            <Route path={`${url}/archived-tickets`}>
                <ArchivedTickets />
            </Route>
            <Route path={`${url}/admin`}>
                <Admin />
            </Route>
        </Switch>
    );
}
