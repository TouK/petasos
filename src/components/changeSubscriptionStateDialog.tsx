import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../store/storeProvider";
import { ConfirmDialog } from "./confirmDialog";

export const ChangeSubscriptionStateDialog = observer(() => {
    const { dialogs } = useStore();
    const dialog = dialogs.changeSubscriptionStateDialog;
    const { subscription } = dialog.params;

    if (!subscription) {
        return null;
    }

    return (
        <>
            <ConfirmDialog
                dialog={dialog}
                taskOnSubmit={subscription.state === "ACTIVE" ? subscription.suspendTask : subscription.activateTask}
                text={`Are you sure you want to ${subscription.state === "ACTIVE" ? "suspend" : "activate"} subscription ${
                    subscription.name
                }?`}
                onSubmitSuccess={async () => {
                    await subscription.fetchTask();
                    subscription.suspendTask.reset();
                    subscription.activateTask.reset();
                }}
            />
        </>
    );
});
