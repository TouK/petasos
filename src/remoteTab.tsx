import React from "react";
import { RootRoutes } from "./components/routes";

interface RemoteComponentProps {
    basepath: string;
}

const RemoteTab = ({ basepath }: RemoteComponentProps) => <RootRoutes basepath={basepath} />;

export default RemoteTab;
