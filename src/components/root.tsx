import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RootRoutes } from "./routes";
import { theme } from "./theme";

export const Root = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box minHeight="100vh" display="flex" flex={1}>
                <Router>
                    <RootRoutes />
                </Router>
            </Box>
        </ThemeProvider>
    );
};
