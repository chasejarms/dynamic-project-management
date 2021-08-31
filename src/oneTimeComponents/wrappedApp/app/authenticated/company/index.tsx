/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useIsCheckingForCompanyAccess } from "../../../../../hooks/useIsCheckingForCompanyAccess";
import { AddCompany } from "./addCompany";
import { TagsBoard } from "./tagsBoard";
import { Boards } from "./boards";
import { CompanyUsers } from "./companyUsers";
import { CreateBoard } from "./createBoard";
import { WeightedBoard } from "./weightedBoard";
import { BoardRouter } from "./boardRouter";

export function Company() {
    const { url } = useRouteMatch();
    const isCheckingForCompanyAccess = useIsCheckingForCompanyAccess();

    return isCheckingForCompanyAccess ? null : (
        <Switch>
            <Route path={`${url}/boards`} exact>
                <Boards />
            </Route>
            <Route path={`${url}/boards/create-board`} exact>
                <CreateBoard />
            </Route>
            <Route path={`${url}/company-users`} exact>
                <CompanyUsers />
            </Route>
            <Route path={`${url}/add-company`} exact>
                <AddCompany />
            </Route>
            <Route path={`${url}/board-router/:boardId`}>
                <BoardRouter />
            </Route>
            <Route path={`${url}/tags-board/:boardId`}>
                <TagsBoard />
            </Route>
            <Route path={`${url}/weighted-board/:boardId`}>
                <WeightedBoard />
            </Route>
        </Switch>
    );
}
