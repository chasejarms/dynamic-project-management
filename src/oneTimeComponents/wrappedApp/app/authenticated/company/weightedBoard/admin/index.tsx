/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForBoardAdminAccess } from "../../../../../../../hooks/useIsCheckingForBoardAdminAccess";
import { TicketTemplates } from "./ticketTemplates";

export function Admin() {
    const { url } = useRouteMatch();
    const isCheckingForBoardAdminAccess = useIsCheckingForBoardAdminAccess();

    return isCheckingForBoardAdminAccess ? null : (
        <Switch>
            <Route path={`${url}/ticket-templates`}>
                <TicketTemplates />
            </Route>
        </Switch>
    );
}
