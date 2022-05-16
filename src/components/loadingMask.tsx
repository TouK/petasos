import { Backdrop, Box, LinearProgress } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";

export function LoadingMask({ open }: { open: boolean }) {
  return createPortal(
    <Backdrop invisible open={open}>
      <Box flex={1} alignSelf="flex-start">
        <LinearProgress color="secondary" />
      </Box>
    </Backdrop>,
    document.body
  );
}
