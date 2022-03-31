import { Alert } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  LinearProgress,
} from "@mui/material";
import { useObserver } from "mobx-react-lite";
import React, { useState } from "react";
import { Dialog } from "../store/dialog";
import { useStore } from "../store/storeProvider";
import { ValidationError } from "../store/topics";
import { StyledDialog } from "./styledMuiComponents";

export const DeleteDialog = ({
  dialog,
  taskOnSubmit,
  text,
  deleteButtonText,
  onSubmitSuccess,
}: {
  dialog: Dialog;
  taskOnSubmit: () => Promise<void | ValidationError>;
  text: string;
  deleteButtonText: string;
  onSubmitSuccess: () => Promise<void>;
}) => {
  const [backendValidationError, setBackendValidationError] =
    useState(undefined);
  const [loading, setLoading] = useState(false);

  const submitFunc = async () => {
    setLoading(true);
    const response = await taskOnSubmit();
    if (response) {
      setBackendValidationError(response.message);
      setLoading(false);
    } else {
      setBackendValidationError(undefined);
      setLoading(false);
      await onSubmitSuccess();
      dialog.setOpen(false);
    }
  };

  const cancelForm = () => {
    setBackendValidationError(undefined);
    dialog.setOpen(false);
  };

  return useObserver(() => (
    <StyledDialog open={dialog.open}>
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
          onClick={submitFunc}
          disabled={loading}
        >
          {deleteButtonText}
        </Button>
      </DialogActions>
    </StyledDialog>
  ));
};

export const DeleteTopicDialog = () => {
  const { dialogs, topics } = useStore();
  return useObserver(() => (
    <DeleteDialog
      dialog={dialogs.deleteTopicDialog}
      taskOnSubmit={topics.selectedTopic.deleteTask}
      text={
        "Are you sure you want to remove topic " +
        topics.selectedTopic.name +
        "?"
      }
      deleteButtonText={"Remove topic"}
      onSubmitSuccess={async () => {
        await topics.fetchTask();
        topics.changeSelectedTopic(null);
      }}
    />
  ));
};

export const DeleteSubscriptionDialog = () => {
  const { dialogs, topics } = useStore();
  return useObserver(() => (
    <DeleteDialog
      dialog={dialogs.deleteSubscriptionDialog}
      taskOnSubmit={async () =>
        await topics.selectedTopic.deleteSubscriptionTask(
          topics.selectedSubscriptionName
        )
      }
      text={
        "Are you sure you want to delete subscription" +
        topics.selectedSubscriptionName +
        "?"
      }
      deleteButtonText={"Delete subscription"}
      onSubmitSuccess={async () => {
        await topics.selectedTopic.fetchSubscriptionsTask();
        topics.changeSelectedSubscription(null);
      }}
    />
  ));
};
