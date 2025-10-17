import { Box } from "@mui/material";
import * as React from "react";
import { ReactNode } from "react";
import { Route, RouteObject, Routes } from "react-router-dom";
import { createRoutes } from "./components/routes";

function createElementsFromRoutes(routes: RouteObject[] = []) {
    return routes.map(({ children, element, index, path }, i) =>
        index ? (
            <Route index element={element} key={i} />
        ) : (
            <Route path={path} element={element} key={i}>
                {createElementsFromRoutes(children)}
            </Route>
        ),
    );
}

export type OpenPortal = (title: string, children: ReactNode) => Promise<() => void>;
type RemoteTabProps = {
    basepath: string;
    tokenGetter?: () => Promise<string>;
    open?: OpenPortal;
};

function RemoteTab({ basepath, tokenGetter, open }: RemoteTabProps) {
    const routes = React.useMemo(() => createRoutes({ basepath, tokenGetter, open }), [basepath, tokenGetter]);
    return (
        <Box height="100%" width="100%" overflow="auto">
            <Routes>{createElementsFromRoutes(routes)}</Routes>
        </Box>
    );
}

export default RemoteTab;
