import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React from "react";
import Helmet from "react-helmet";
import { Options } from "../config";
import { StoreProvider } from "../store/storeProvider";
import { App } from "./app";

export const Root = () => {
  return (
    <StoreProvider options={Options}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossOrigin"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <style type="text/css">
          {`
            html {overflow: hidden; height: 100%}
            body {height: 100%; overflow: auto; margin: 0}
          `}
        </style>
      </Helmet>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <App />
      </LocalizationProvider>
    </StoreProvider>
  );
};
