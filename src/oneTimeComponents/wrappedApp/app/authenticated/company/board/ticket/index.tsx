/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { TicketHome } from "./ticketHome";

export function Ticket() {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/data`} exact>
                <TicketHome />
            </Route>
        </Switch>
    );
}
