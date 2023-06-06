import { Backdrop, Box, LinearProgress } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";
import { MAIN_CLASSNAME } from "./mainLayout";

export function LoadingMask({ open }: { open: boolean }) {
    const container = document.querySelector(`.${MAIN_CLASSNAME}`)?.parentElement;
    if (!container) {
        return null;
    }

    return createPortal(
        <Backdrop invisible open={open} sx={{ position: "absolute" }}>
            <Box flex={1} alignSelf="flex-start">
                <LinearProgress color="primary" />
            </Box>
        </Backdrop>,
        container,
    );
}
