import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import React from "react";
import Helmet from "react-helmet";
import {StoreProvider} from "../store/storeProvider";
import {App} from "./app";

export const Root = () => {
    return (
        <StoreProvider>
            <Helmet>
                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Gugi" />
                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
                <style type="text/css">{`
                    html {overflow: hidden; height: 100%}
                    body {height: 100%; overflow: auto; margin: 0}
                `}</style>
            </Helmet>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <App />
            </LocalizationProvider>
        </StoreProvider>
    );
};

