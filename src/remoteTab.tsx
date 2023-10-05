import { Box } from "@mui/material";
import React from "react";
import { RootRoutes } from "./components/routes";

interface RemoteComponentProps {
    basepath: string;
}

const RemoteTab = ({ basepath }: RemoteComponentProps) => (
    <Box height="100%" width="100%" overflow="auto">
        <RootRoutes basepath={basepath} />
    </Box>
);

export default RemoteTab;
