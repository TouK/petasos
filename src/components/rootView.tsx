import React, { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { EnsureFetched } from "./ensureFetched";

export const RootView = ({ children = <Outlet /> }: PropsWithChildren<unknown>) => {
    const { topics } = useStore();
    return <EnsureFetched task={topics.fetchTask}>{children}</EnsureFetched>;
};
