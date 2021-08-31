/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { CreateTicketTemplate } from "./createTicketTemplate";

export function TicketTemplates() {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/create-ticket-template`}>
                <CreateTicketTemplate />
            </Route>
        </Switch>
    );
}
