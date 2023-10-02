import { Box, Paper } from "@mui/material";
import React, { PropsWithChildren } from "react";

export function ContentBox({ children }: PropsWithChildren<unknown>) {
    return <Box component={Paper}>{children}</Box>;
}
