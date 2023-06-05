import { ThemeProvider } from "@mui/material";
import React from "react";
import { RootRoutes } from "./components/routes";
import { theme } from "./components/theme";

const Root = () => (
    <ThemeProvider theme={theme}>
        <RootRoutes />
    </ThemeProvider>
);

export default Root;
