/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { BoardHome } from "./boardHome";
import Columns from "./columns";
import { CreateTicket } from "./createTicket";
import { Priorities } from "./priorities";

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
        </Switch>
    );
}
