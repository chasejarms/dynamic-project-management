import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import { SignIn } from "./signIn";
import { useAxiosInterceptor } from "../../../hooks/useAxiosInterceptor";
import { Authenticated } from "./authenticated";
import { useRouterDebug } from "../../../hooks/useRouterDebug";
import { Home } from "./home";
import { RequestDemo } from "./requestDemo";
import { SignUp } from "./signUp";
import { ResetPassword } from "./resetPassword";
import { EnterNewPassword } from "./enterNewPassword";

export function App() {
    useAxiosInterceptor();
    useRouterDebug(true);

    return (
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/contact" exact>
                <RequestDemo />
            </Route>
            <Route path="/sign-in" exact>
                <SignIn />
            </Route>
            {/* <Route path="/sign-up" exact>
                <SignUp />
            </Route> */}
            <Route path="/reset-password" exact>
                <ResetPassword />
            </Route>
            <Route path="/enter-new-password" exact>
                <EnterNewPassword />
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
