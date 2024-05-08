import { Box, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RootRoutes } from "./routes";
import { theme } from "./theme";
import { deepmerge } from "@mui/utils";

export const Root = () => {
    return (
        <ThemeProvider theme={(outerTheme: Theme) => {
            if(!Object.keys(outerTheme).length) {
                return theme
            }

            // Let's set aside the parent form style since we won't be using the same form style throughout the entire app.
            const {components: {MuiFormControl, MuiFormHelperText, MuiFormLabel}, ...filteredOuterTheme} = outerTheme

            return deepmerge(theme, filteredOuterTheme )

        }}>
            <CssBaseline />
            <Box minHeight="100vh" display="flex" flex={1}>
                <Router>
                    <RootRoutes />
                </Router>
            </Box>
        </ThemeProvider>
    );
};
