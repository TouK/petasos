import { observer } from "mobx-react-lite";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ConfirmDialog } from "./confirmDialog";

export const DeleteGroupDialog = observer(() => {
  const { dialogs, groups, topics } = useStore();
  const [params, setParams] = useSearchParams();
  const dialog = dialogs.deleteGroupDialog;
  const { group } = dialog.params;
  return (
    <ConfirmDialog
      dialog={dialog}
      taskOnSubmit={groups.deleteTask.wrap((fn) => () => fn(group))}
      text={`Are you sure you want to delete group ${group}?`}
      confirmText={"Remove topic"}
      onSubmitSuccess={async () => {
        groups.fetchTask();
        topics.fetchTask();
        params.delete("group");
        setParams(params);
      }}
    />
  );
});
