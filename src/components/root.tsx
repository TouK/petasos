import React from 'react';
import Helmet from 'react-helmet';
import {hot} from 'react-hot-loader/root';
import {StoreProvider} from '../store/storeProvider';
import {App} from './app';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

export const Root = hot(() => {
    return (
        <StoreProvider>
            <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Gugi"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
                <style type="text/css">{`
                    html {overflow: hidden; height: 100%}
                    body {height: 100%; overflow: auto; margin: 0}
                `}</style>
            </Helmet>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <App/>
            </MuiPickersUtilsProvider>
        </StoreProvider>
    );
});

