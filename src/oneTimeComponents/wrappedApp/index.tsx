import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import { App } from "./app";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../../redux/store";

const theme = createTheme({});

export function WrappedApp() {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Router>
                    <App />
                </Router>
            </ThemeProvider>
        </ReduxProvider>
    );
}
