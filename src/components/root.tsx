import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoutes } from "./routes";
import { theme } from "./theme";

const router = createBrowserRouter(createRoutes());

export const Root = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box minHeight="100vh" display="flex" flex={1}>
                <RouterProvider router={router} />
            </Box>
        </ThemeProvider>
    );
};
