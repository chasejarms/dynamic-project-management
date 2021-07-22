import React from "react";

import { Route, Switch, useRouteMatch, useParams } from "react-router-dom";
import { Companies } from "./companies";
import { Boards } from "./company/boards";
import { CreateBoard } from "./company/createBoard";

export function Authenticated() {
    const { url } = useRouteMatch();
    const { companyId } = useParams<{
        companyId: string;
    }>();

    return (
        <Switch>
            <Route path={`${url}/companies`} exact>
                <Companies />
            </Route>
            <Route path={`${url}/company/:companyId/boards`} exact>
                <Boards />
            </Route>
            <Route path={`${url}/company/:companyId/boards/create-board`}>
                <CreateBoard />
            </Route>
        </Switch>
    );
}
