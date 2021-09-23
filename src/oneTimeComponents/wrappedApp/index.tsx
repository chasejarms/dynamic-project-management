import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { App } from "./app";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../../redux/store";
import { BreakpointProvider } from "./app/hooks/useBreakpoint";

const theme = createTheme({ palette: { mode: "dark" } });

export function WrappedApp() {
    const queries = {
        max768: "(max-width: 768px)",
        between768And993: "(min-width: 769px) and (max-width: 992px)",
        min993: "(min-width: 993px)",
        min1200: "(min-width: 1200px)",
    };

    return (
        <BreakpointProvider queries={queries}>
            <ReduxProvider store={store}>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Router>
                        <App />
                    </Router>
                </ThemeProvider>
            </ReduxProvider>
        </BreakpointProvider>
    );
}
