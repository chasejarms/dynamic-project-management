import React from "react";

import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Companies } from "./companies";

export function AuthenticatedApp() {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/companies`} exact>
                <Companies />
            </Route>
        </Switch>
    );
}
