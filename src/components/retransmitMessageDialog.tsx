import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../store/storeProvider";
import { ConfirmDialog } from "./confirmDialog";

export const RetransmitMessageDialog = observer(() => {
    const { dialogs } = useStore();
    const dialog = dialogs.retransmitMessageDialog;
    const { subscription, selectedDate } = dialog.params;

    const timeFormat = "dddd, MMMM Do, YYYY h:mm:ss A";

    if (!subscription || !selectedDate) {
        return null;
    }

    return (
        <>
            <ConfirmDialog
                dialog={dialog}
                taskOnSubmit={subscription.retransmitMessagesTask.wrap((fn) => () => fn(selectedDate))}
                text={`Are you sure you want to retransmit all messages since ${selectedDate.format(timeFormat)}?`}
                confirmText={"Retransmit"}
                onSubmitSuccess={async () => subscription.retransmitMessagesTask.reset()}
            />
        </>
    );
});
