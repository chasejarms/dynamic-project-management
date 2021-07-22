import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import { SignIn } from "./signIn";
import { useAxiosInterceptor } from "../../../hooks/useAxiosInterceptor";
import { Authenticated } from "./authenticated";
import { useRouterDebug } from "../../../hooks/useRouterDebug";

export function App() {
    useAxiosInterceptor();
    useRouterDebug(false);

    return (
        <Switch>
            <Route path="/sign-in" exact>
                <SignIn />
            </Route>
            <Route path="/app">
                <Authenticated />
            </Route>
            <Route
                render={() => {
                    return (
                        <Redirect
                            to={{
                                pathname: "/sign-in",
                            }}
                        ></Redirect>
                    );
                }}
            />
        </Switch>
    );
}
