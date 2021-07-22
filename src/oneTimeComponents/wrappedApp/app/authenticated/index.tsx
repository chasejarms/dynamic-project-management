import React from "react";

import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Companies } from "./companies";
import { Board } from "./company/board";
import { Boards } from "./company/boards";
import { CreateBoard } from "./company/createBoard";

export function Authenticated() {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/companies`} exact>
                <Companies />
            </Route>
            <Route path={`${url}/company/:companyId/boards`} exact>
                <Boards />
            </Route>
            <Route path={`${url}/company/:companyId/boards/create-board`} exact>
                <CreateBoard />
            </Route>
            <Route path={`${url}/company/:companyId/board/:boardId`}>
                <Board />
            </Route>
        </Switch>
    );
}
