import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import { DevelopmentSignIn } from "../developmentSignIn";
import { Companies } from "../companies";
import { useAxiosInterceptor } from "../../hooks/useAxiosInterceptor";

export function App() {
    useAxiosInterceptor();

    return (
        <Switch>
            <Route path="/development-sign-in" exact>
                <DevelopmentSignIn />
            </Route>
            <Route path="/companies" exact>
                <Companies />
            </Route>
            <Route
                render={() => {
                    return (
                        <Redirect
                            to={{
                                pathname: "/development-sign-in",
                            }}
                        ></Redirect>
                    );
                }}
            />
        </Switch>
    );
}
