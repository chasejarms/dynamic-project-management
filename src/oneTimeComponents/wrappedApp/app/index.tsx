import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import { SignIn } from "./signIn";
import { useAxiosInterceptor } from "./hooks/useAxiosInterceptor";
import { Authenticated } from "./authenticated";
import { useRouterDebug } from "./hooks/useRouterDebug";
import { Home } from "./home";
import { RequestDemo } from "./requestDemo";
// import { SignUp } from "./signUp";
import { ResetPassword } from "./resetPassword";
import { EnterNewPassword } from "./enterNewPassword";
import { RouteCreator } from "./utils/routeCreator";

export function App() {
    useAxiosInterceptor();
    useRouterDebug(false);

    return (
        <Switch>
            <Route path={RouteCreator.home()} exact>
                <Home />
            </Route>
            <Route path={RouteCreator.contact()} exact>
                <RequestDemo />
            </Route>
            <Route path={RouteCreator.signIn()} exact>
                <SignIn />
            </Route>
            {/* <Route path="/sign-up" exact>
                <SignUp />
            </Route> */}
            <Route path={RouteCreator.resetPassword()} exact>
                <ResetPassword />
            </Route>
            <Route path={RouteCreator.enterNewPassword()} exact>
                <EnterNewPassword />
            </Route>
            <Route path={RouteCreator.app()}>
                <Authenticated />
            </Route>
            <Route
                render={() => {
                    return (
                        <Redirect
                            to={{
                                pathname: RouteCreator.signIn(),
                            }}
                        ></Redirect>
                    );
                }}
            />
        </Switch>
    );
}
