import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";

export function LoadingMask({ open }: { open: boolean }) {
  return createPortal(
    <Backdrop
      open={open}
      style={{
        color: "white",
        zIndex: 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>,
    document.body
  );
}
