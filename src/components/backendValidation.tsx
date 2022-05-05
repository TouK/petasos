import { Alert } from "@mui/lab";
import React from "react";
import dialogStyles from "../styles/dialog.css";

export function BackendValidation({ text }: { text?: string }) {
  return (
    <div className={dialogStyles.DialogRow} style={{ marginBottom: "10px" }}>
      {text && (
        <Alert severity="error" style={{ width: "100%" }}>
          {text}
        </Alert>
      )}
    </div>
  );
}
