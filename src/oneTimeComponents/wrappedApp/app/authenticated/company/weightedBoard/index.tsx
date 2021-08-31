/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForBoardAccess } from "../../../../../../hooks/useIsCheckingForBoardAccess";

export function WeightedBoard() {
    const { url } = useRouteMatch();
    const isCheckingForBoardAccess = useIsCheckingForBoardAccess();

    return isCheckingForBoardAccess ? null : (
        <Switch>
            <Route path={`${url}/tickets`} exact>
                <div />
            </Route>
            <Route path={`${url}/create-ticket`} exact>
                <div />
            </Route>
            <Route path={`${url}/backlog-tickets`} exact>
                <div />
            </Route>
            <Route path={`${url}/completed-tickets`} exact>
                <div />
            </Route>
            <Route path={`${url}/ticket/:ticketId`}>
                <div />
            </Route>
            <Route path={`${url}/admin`}>
                <div />
            </Route>
        </Switch>
    );
}
