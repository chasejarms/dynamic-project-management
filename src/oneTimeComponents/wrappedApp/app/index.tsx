import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import { SignIn } from "./signIn";
import { useAxiosInterceptor } from "../../../hooks/useAxiosInterceptor";
import { Authenticated } from "./authenticated";
import { useRouterDebug } from "../../../hooks/useRouterDebug";
import { Home } from "./home";
import { Pricing } from "./pricing";
import { Contact } from "./contact";
import { SignUp } from "./signUp";
import { ResetPassword } from "./resetPassword";

export function App() {
    useAxiosInterceptor();
    useRouterDebug(false);

    return (
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/pricing" exact>
                <Pricing />
            </Route>
            <Route path="/contact" exact>
                <Contact />
            </Route>
            <Route path="/sign-in" exact>
                <SignIn />
            </Route>
            <Route path="/sign-up" exact>
                <SignUp />
            </Route>
            <Route path="/reset-password" exact>
                <ResetPassword />
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
