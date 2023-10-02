import React from "react";
import { Outlet } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { EnsureFetched } from "./ensureFetched";

export const RootView = () => {
    const { topics } = useStore();
    return (
        <EnsureFetched task={topics.fetchTask}>
            <Outlet />
        </EnsureFetched>
    );
};
