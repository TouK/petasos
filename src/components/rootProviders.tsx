import { Theme, ThemeProvider } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { configure } from "mobx";
import * as React from "react";
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Options } from "../config";
import { StoreOptions } from "../store/store";
import { StoreProvider } from "../store/storeProvider";
import { tokenStorage } from "../tokenStorage";
import { theme } from "./theme";

configure({
    enforceActions: "observed",
});

export const RootPath = createContext<string | null>(null);

export type RootProvidersProps = {
    tokenGetter: () => Promise<string>;
    basepath?: string;
};

export const RootProviders = ({ children = <Outlet />, tokenGetter, basepath }: PropsWithChildren<RootProvidersProps>) => {
    useEffect(() => {
        tokenStorage.replaceTokenGetter(tokenGetter);
    }, [tokenGetter]);

    const open = useCallback<StoreOptions["open"]>((dialog, key, params) => {
        dialog();
    }, []);

    const options = useMemo<StoreOptions>(() => ({ ...Options, open }), [open]);

    return (
        <RootPath.Provider value={basepath}>
            <StoreProvider options={options}>
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
        </RootPath.Provider>
    );
};
