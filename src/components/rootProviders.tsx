import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import * as React from "react";
import { PropsWithChildren } from "react";
import { Options } from "../config";
import { StoreProvider } from "../store/storeProvider";

export const RootProviders = ({ children }: PropsWithChildren<unknown>) => (
    <StoreProvider options={Options}>
        <LocalizationProvider dateAdapter={AdapterMoment}>{children}</LocalizationProvider>
    </StoreProvider>
);
