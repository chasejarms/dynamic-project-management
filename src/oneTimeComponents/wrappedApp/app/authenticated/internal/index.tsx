/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForInternalUser } from "../../../../../hooks/useIsCheckingForInternalUser";
import { LearningCenterEditor } from "./learningCenterEditor";

export function Internal() {
    const { url } = useRouteMatch();
    const isCheckingForInternalUser = useIsCheckingForInternalUser();

    return isCheckingForInternalUser ? null : (
        <Switch>
            <Route path={`${url}/learning-center-editor`} exact>
                <LearningCenterEditor />
            </Route>
        </Switch>
    );
}
