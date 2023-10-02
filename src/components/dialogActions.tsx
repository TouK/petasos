import { Button, DialogActions as MuiDialogActions } from "@mui/material";
import React from "react";

export function DialogActions(props: {
    cancelForm: () => void;
    isSubmitting: boolean;
    submitForm: (() => Promise<void>) & (() => Promise<any>);
    submitButtonText: string;
}) {
    const { cancelForm, isSubmitting, submitForm, submitButtonText } = props;
    return (
        <MuiDialogActions>
            <Button color="inherit" variant="outlined" onClick={cancelForm} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button color="inherit" variant="outlined" onClick={submitForm} disabled={isSubmitting}>
                {submitButtonText}
            </Button>
        </MuiDialogActions>
    );
}
