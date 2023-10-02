import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ConfirmDialog } from "./confirmDialog";

export const DeleteSubscriptionDialog = observer(() => {
    const { dialogs } = useStore();
    const navigate = useNavigate();
    const dialog = dialogs.deleteSubscriptionDialog;
    const { subscription, topic } = dialog.params;

    if (!(subscription && topic)) {
        return null;
    }

    return (
        <ConfirmDialog
            dialog={dialog}
            taskOnSubmit={subscription.deleteTask}
            text={`Are you sure you want to delete subscription ${subscription.name}?`}
            confirmText={"Delete subscription"}
            onSubmitSuccess={async () => {
                await topic.fetchSubscriptionsTask();
                navigate(`/${topic.name}`);
            }}
        />
    );
});
