/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { BoardContainer } from "../../../../../../components/boardContainer";
import { useIsCheckingForBoardAccess } from "../../../../../../hooks/useIsCheckingForBoardAccess";
import { Admin } from "./admin";
import { BacklogTickets } from "./backlogTickets";
import { BoardHome } from "./boardHome";
import { CompletedTickets } from "./completedTickets";
import { CreateTicket } from "./createTicket";
import { Priorities } from "./priorities";
import { Ticket } from "./ticket";

export function Board() {
    const { url } = useRouteMatch();
    const isCheckingForBoardAccess = useIsCheckingForBoardAccess();

    return isCheckingForBoardAccess ? null : (
        <Switch>
            <Route path={`${url}/tickets`} exact>
                <BoardHome />
            </Route>
            <Route path={`${url}/create-ticket`} exact>
                <CreateTicket />
            </Route>
            <Route path={`${url}/priorities`} exact>
                <Priorities />
            </Route>
            <Route path={`${url}/backlog-tickets`} exact>
                <BacklogTickets />
            </Route>
            <Route path={`${url}/completed-tickets`} exact>
                <CompletedTickets />
            </Route>
            <Route path={`${url}/ticket/:ticketId`}>
                <Ticket />
            </Route>
            <Route path={`${url}/admin`}>
                <Admin />
            </Route>
        </Switch>
    );
}
