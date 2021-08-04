/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForBoardAdminAccess } from "../../../../../../../hooks/useIsCheckingForBoardAdminAccess";
import { Columns } from "./columns";
import { BoardUsers } from "./boardUsers";
import { TicketTemplates } from "../ticketTemplates";

export function Admin() {
    const { url } = useRouteMatch();
    const isCheckingForBoardAdminAccess = useIsCheckingForBoardAdminAccess();

    return isCheckingForBoardAdminAccess ? null : (
        <Switch>
            <Route path={`${url}/board-users`} exact>
                <BoardUsers />
            </Route>
            <Route path={`${url}/columns`} exact>
                <Columns />
            </Route>
            <Route path={`${url}/ticket-templates`}>
                <TicketTemplates />
            </Route>
        </Switch>
    );
}
