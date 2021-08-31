/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForBoardAccess } from "../../../../../../hooks/useIsCheckingForBoardAccess";
import { Admin } from "./admin";

export function WeightedBoard() {
    const { url } = useRouteMatch();
    const isCheckingForBoardAccess = useIsCheckingForBoardAccess();

    return isCheckingForBoardAccess ? null : (
        <Switch>
            <Route path={`${url}/admin`}>
                <Admin />
            </Route>
        </Switch>
    );
}
