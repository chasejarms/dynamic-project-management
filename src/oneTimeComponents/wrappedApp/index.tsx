import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline, PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { App } from "./app";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../../redux/store";
import { BreakpointProvider } from "./app/hooks/useBreakpoint";

export const ColorModeContext = React.createContext({
    toggleColorMode: () => {},
});

export function WrappedApp() {
    const [mode, setMode] = React.useState<PaletteMode>("light");
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === "light" ? "dark" : "light"
                );
            },
        }),
        []
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: "#3f51b5",
                    },
                    secondary: {
                        main: "#f50057",
                    },
                },
            }),
        [mode]
    );

    const queries = {
        max768: "(max-width: 768px)",
        between768And993: "(min-width: 769px) and (max-width: 992px)",
        min993: "(min-width: 993px)",
        min1200: "(min-width: 1200px)",
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
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
        </ColorModeContext.Provider>
    );
}
