import React from "react";

import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { DevelopmentSignIn } from "../developmentSignIn";
import { Companies } from "../companies";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({});

export function App() {
    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Router>
                <Route path="/development-sign-in" exact>
                    <DevelopmentSignIn />
                </Route>
                <Route path="/companies" exact>
                    <Companies />
                </Route>
                <Redirect
                    to={{
                        pathname: "/development-sign-in",
                    }}
                />
            </Router>
        </ThemeProvider>
    );
}
