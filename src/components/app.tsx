import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RootRoutes } from "./routes";

export const App = () => (
    <Router>
        <RootRoutes />
    </Router>
);
