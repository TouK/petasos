import { Theme, ThemeProvider } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { configure, toJS } from "mobx";
import * as React from "react";
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Options } from "../config";
import { OpenPortal } from "../remoteTab";

import { Dialog } from "../store/dialog";
import { DialogsType, StoreOptions } from "../store/store";
import { StoreProvider } from "../store/storeProvider";
import { tokenStorage } from "../tokenStorage";
import { theme } from "./theme";

configure({
    enforceActions: "observed",
});

export const RootPath = createContext<string | null>(null);
export const ShouldUseDialogPortals = createContext<boolean>(false);

export type RootProvidersProps = {
    tokenGetter: () => Promise<string>;
    basepath?: string;
    open?: OpenPortal;
};

export const RootProviders = ({ children = <Outlet />, tokenGetter, basepath, open }: PropsWithChildren<RootProvidersProps>) => {
    useEffect(() => {
        tokenStorage.replaceTokenGetter(tokenGetter);
    }, [tokenGetter]);

    const extendedOpen = useCallback(
        async <K extends keyof DialogsType>(openDialog: (callback?: (dialog: DialogsType[K]) => void) => Promise<void>) => {
            if (!open) {
                return openDialog();
            }

            let close: () => void;
            await openDialog(async <K extends keyof DialogsType>(dialog: DialogsType[K]) => {
                if (dialog instanceof Dialog) {
                    const title = toJS(dialog.title);
                    close = await open(title, dialog.view);
                }
            });
            close?.();
        },
        [open],
    );

    const options = useMemo<StoreOptions>(
        () => ({
            ...Options,
            open: extendedOpen,
        }),
        [extendedOpen],
    );

    return (
        <RootPath.Provider value={basepath}>
            <ShouldUseDialogPortals.Provider value={Boolean(open)}>
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
            </ShouldUseDialogPortals.Provider>
        </RootPath.Provider>
    );
};
