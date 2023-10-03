import { observer } from "mobx-react-lite";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ConfirmDialog } from "./confirmDialog";

export const DeleteTopicDialog = observer(() => {
    const { dialogs, topics } = useStore();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dialog = dialogs.deleteTopicDialog;
    const { topic } = dialog.params;

    if (!topic) {
        return null;
    }

    return (
        <ConfirmDialog
            dialog={dialog}
            taskOnSubmit={topic.deleteTask}
            text={`Are you sure you want to remove topic ${topic.displayName}?`}
            confirmText={"Remove topic"}
            onSubmitSuccess={async () => {
                await topics.fetchTask();
                navigate(pathname.replace(topic.name, ""));
            }}
        />
    );
});
