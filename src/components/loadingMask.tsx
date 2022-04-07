import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

export function LoadingMask({ open }: { open: boolean }) {
  return (
    <Backdrop
      open={open}
      style={{
        color: "white",
        zIndex: 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
