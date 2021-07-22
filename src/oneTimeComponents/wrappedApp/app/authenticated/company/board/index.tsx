/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { BacklogTickets } from "./backlogTickets";
import { BoardHome } from "./boardHome";
import { Columns } from "./columns";
import { CompletedTickets } from "./completedTickets";
import { CreateTicket } from "./createTicket";
import { Priorities } from "./priorities";
import { TicketTemplates } from "./ticketTemplates";

export function Board() {
    const { url } = useRouteMatch();

    return (
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
            <Route path={`${url}/columns`} exact>
                <Columns />
            </Route>
            <Route path={`${url}/ticket-templates`} exact>
                <TicketTemplates />
            </Route>
            <Route path={`${url}/backlog-tickets`} exact>
                <BacklogTickets />
            </Route>
            <Route path={`${url}/completed-tickets`} exact>
                <CompletedTickets />
            </Route>
        </Switch>
    );
}
