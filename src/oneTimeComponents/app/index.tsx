import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import { SignIn } from "../signIn";
import { useAxiosInterceptor } from "../../hooks/useAxiosInterceptor";
import { AuthenticatedApp } from "../authenticatedApp";

export function App() {
    useAxiosInterceptor();

    return (
        <Switch>
            <Route path="/sign-in" exact>
                <SignIn />
            </Route>
            <Route path="/app">
                <AuthenticatedApp />
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
