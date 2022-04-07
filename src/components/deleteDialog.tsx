import { Alert } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  LinearProgress,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { Task } from "mobx-task/lib/task";
import React, { useEffect } from "react";
import { Dialog } from "../store/dialog";
import { ValidationError } from "../store/topics";
import { StyledDialog } from "./styledMuiComponents";

export const DeleteDialog = observer(
  ({
    dialog,
    taskOnSubmit,
    text,
    deleteButtonText,
    onSubmitSuccess,
  }: {
    dialog: Dialog<unknown>;
    taskOnSubmit: Task<[], Promise<void | ValidationError>>;
    text: string;
    deleteButtonText: string;
    onSubmitSuccess: () => Promise<void>;
  }) => {
    const loading = taskOnSubmit.pending;
    const backendValidationError = taskOnSubmit.rejected
      ? taskOnSubmit.error
      : taskOnSubmit.result
      ? taskOnSubmit.result.message
      : null;

    useEffect(() => {
      if (taskOnSubmit.resolved) {
        onSubmitSuccess();
        dialog.close();
      }
    }, [dialog, onSubmitSuccess, taskOnSubmit.resolved]);

    useEffect(() => {
      taskOnSubmit.reset();
    }, [taskOnSubmit]);

    const cancelForm = () => dialog.close();

    return (
      <StyledDialog open={dialog.isOpen}>
        <DialogContent>
          {backendValidationError && (
            <div style={{ marginBottom: "10px" }}>
              <Alert severity="error">{backendValidationError}</Alert>
            </div>
          )}
          <DialogContentText>{text}</DialogContentText>
          {loading && <LinearProgress color="secondary" />}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            disabled={loading}
            onClick={cancelForm}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={taskOnSubmit}
            disabled={loading}
            autoFocus
          >
            {deleteButtonText}
          </Button>
        </DialogActions>
      </StyledDialog>
    );
  }
);
