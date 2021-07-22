/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { BoardHome } from "./boardHome";
import { CreateTicket } from "./createTicket";

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
        </Switch>
    );
}
