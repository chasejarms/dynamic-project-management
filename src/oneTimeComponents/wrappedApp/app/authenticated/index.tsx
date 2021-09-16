/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Api } from "../../../../api";
import { CenterLoadingSpinner } from "./components/centerLoadingSpinner";
import { setAppBootstrapInformation } from "../../../../redux/appBootstrapInformation";
import { IStoreState } from "../../../../redux/storeState";
import { Internal } from "./internal";
import { Companies } from "./companies";
import { Company } from "./company";

export function Authenticated() {
    const { url } = useRouteMatch();

    const isLoading = useSelector((state: IStoreState) => {
        return state.appBootstrapInformation.isLoading;
    });
    const dispatch = useDispatch();
    useEffect(() => {
        if (!isLoading) return;

        let didCancel = false;

        Api.company
            .getAppBootstrapInformation()
            .then((appBootstrapInformationFromRequest) => {
                if (didCancel) return;
                const action = setAppBootstrapInformation({
                    companies:
                        appBootstrapInformationFromRequest.companyInformationItems,
                    users: appBootstrapInformationFromRequest.companyUserItems,
                    internalUser:
                        appBootstrapInformationFromRequest.internalUser,
                    isLoading: false,
                });
                dispatch(action);
            })
            .catch(() => {
                if (didCancel) return;
            })
            .finally(() => {
                if (didCancel) return;
            });

        return () => {
            didCancel = true;
        };
    }, [isLoading]);

    const classes = createClasses();
    return isLoading ? (
        <div css={classes.fullPageLoadingSpinnerContainer}>
            <CenterLoadingSpinner size="large" />
        </div>
    ) : (
        <Switch>
            <Route path={`${url}/companies`} exact>
                <Companies />
            </Route>
            <Route path={`${url}/company/:companyId`}>
                <Company />
            </Route>
            <Route path={`${url}/internal`}>
                <Internal />
            </Route>
        </Switch>
    );
}

function createClasses() {
    const fullPageLoadingSpinnerContainer = css`
        height: 100vh;
        width: 100vw;
        display: flex;
    `;

    return {
        fullPageLoadingSpinnerContainer,
    };
}
