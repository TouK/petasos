import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { DeleteDialog } from "./deleteDialog";

export const DeleteTopicDialog = observer(() => {
  const { dialogs, topics } = useStore();
  const navigate = useNavigate();
  const dialog = dialogs.deleteTopicDialog;
  const { topic } = dialog.params;

  if (!topic) {
    return null;
  }

  return (
    <DeleteDialog
      dialog={dialog}
      taskOnSubmit={topic.deleteTask}
      text={`Are you sure you want to remove topic ${topic.displayName}?`}
      deleteButtonText={"Remove topic"}
      onSubmitSuccess={async () => {
        await topics.fetchTask();
        navigate("/");
      }}
    />
  );
});
