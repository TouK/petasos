import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import Helmet from "react-helmet";
import { App } from "./app";
import { theme } from "./theme";

export const Root = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
};
