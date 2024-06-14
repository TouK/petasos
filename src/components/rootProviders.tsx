import { Theme, ThemeProvider } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { configure } from "mobx";
import * as React from "react";
import { PropsWithChildren } from "react";
import { Options } from "../config";
import { StoreProvider } from "../store/storeProvider";
import { theme } from "./theme";

configure({
    enforceActions: "observed",
});

export const RootProviders = ({ children }: PropsWithChildren<unknown>) => (
    <StoreProvider options={Options}>
        <ThemeProvider
            theme={(outerTheme: Theme) => {
                if (!Object.keys(outerTheme).length) {
                    return theme;
                }

                // Let's set aside the parent form style since we won't be using the same form style throughout the entire app.
                const {
                    components: { MuiFormControl, MuiFormHelperText, MuiFormLabel },
                    ...filteredOuterTheme
                } = outerTheme;

                return deepmerge(theme, filteredOuterTheme);
            }}
        >
            <LocalizationProvider dateAdapter={AdapterMoment}>{children}</LocalizationProvider>
        </ThemeProvider>
    </StoreProvider>
);
