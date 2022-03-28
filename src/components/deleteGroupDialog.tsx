import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@mui/material";
import {useObserver} from "mobx-react-lite";
import React, {useState} from "react";
import {useStore} from "../store/storeProvider";
import {StyledDialog} from "./styledMuiComponents";

export const DeleteGroupDialog = () => {
    const {dialogs, groups, topics} = useStore();
    const [deleting, setDeleting] = useState(false);

    const deleteGroup = async () => {
        setDeleting(true)
        groups.changeSelectedGroup(null);
        await groups.deleteTask(dialogs.deleteGroupDialog.groupToBeDeleted);
        await groups.fetchTask();
        await topics.fetchTask();
        setDeleting(false)
        dialogs.deleteGroupDialog.setGroupToBeDeleted(undefined);
    }

    return useObserver(() =>
        <StyledDialog open={dialogs.deleteGroupDialog.groupToBeDeleted !== undefined}>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete
                    group <b>{dialogs.deleteGroupDialog.groupToBeDeleted}</b>?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" size="small" disabled={deleting}
                        onClick={() => dialogs.deleteGroupDialog.setGroupToBeDeleted(undefined)}>Cancel</Button>
                <Button color="secondary" variant="contained" size="small" onClick={deleteGroup}
                        disabled={deleting}>Delete group</Button>
            </DialogActions>
        </StyledDialog>
    )
}
