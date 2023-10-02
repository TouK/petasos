import { Alert } from "@mui/lab";
import { Button, DialogActions, DialogContent, DialogContentText, LinearProgress } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Task } from "mobx-task/lib/task";
import React, { useEffect } from "react";
import { Dialog } from "../store/dialog";
import { ValidationError } from "../store/topics";
import { StyledDialog } from "./styledMuiComponents";

export const ConfirmDialog = observer(
    ({
        dialog,
        taskOnSubmit,
        text,
        confirmText = "Confirm",
        onSubmitSuccess,
    }: {
        dialog: Dialog<unknown>;
        taskOnSubmit: Task<[], Promise<void | ValidationError>>;
        text: string;
        confirmText?: string;
        onSubmitSuccess?: () => Promise<void>;
    }) => {
        const loading = taskOnSubmit.pending;
        const backendValidationError = taskOnSubmit.rejected
            ? taskOnSubmit.error
            : taskOnSubmit.result
            ? taskOnSubmit.result.message
            : null;

        useEffect(() => {
            if (taskOnSubmit.resolved) {
                onSubmitSuccess?.();
                dialog.close();
            }
        }, [dialog, onSubmitSuccess, taskOnSubmit.resolved]);

        useEffect(() => {
            taskOnSubmit.reset();
        }, [taskOnSubmit]);

        const cancelForm = () => dialog.close();

        return (
            <StyledDialog open={dialog.isOpen}>
                {loading && <LinearProgress color="secondary" />}
                <DialogContent>
                    {backendValidationError && (
                        <div style={{ marginBottom: "10px" }}>
                            <Alert severity="error">{backendValidationError}</Alert>
                        </div>
                    )}
                    <DialogContentText>{text}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="inherit" disabled={loading} onClick={cancelForm}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={taskOnSubmit} disabled={loading} autoFocus>
                        {confirmText}
                    </Button>
                </DialogActions>
            </StyledDialog>
        );
    },
);
