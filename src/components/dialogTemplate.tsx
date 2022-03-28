import {Alert} from "@mui/lab";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    LinearProgress,
    ThemeProvider
} from "@mui/material";
import {Form, Formik} from "formik";
import {useObserver} from "mobx-react-lite";
import React, {useState} from "react";
import {FormValues} from "../models";
import {Dialog} from "../store/dialog";
import {ValidationError} from "../store/topics";
import dialogStyles from "../styles/dialog.css";
import {StyledDialog} from "./styledMuiComponents";
import {formTheme} from "./theme";

export function DialogTemplate<T extends FormValues> ({
    dialog,
    validateFunc,
    taskOnSubmit,
    onSubmitSuccess,
    onCancel,
    dialogTitle,
    submitButtonText,
    initialValues,
    basicFields,
    advancedFields,
    wider
}: {
    dialog: Dialog, validateFunc: ((FormValues, boolean) => void),
    taskOnSubmit: (
        T,
        boolean
    ) => Promise<void | ValidationError>, onSubmitSuccess: (T) => Promise<void>,
    onCancel?: () => void, dialogTitle: string, submitButtonText: string, initialValues: T,
    basicFields: ((FormikErrors) => JSX.Element[]), advancedFields: ((FormikErrors) => JSX.Element[]), wider: boolean
}) {
    const [backendValidationError, setBackendValidationError] = useState(undefined)
    const [advancedOptions, setAdvancedOptions] = useState(false)

    const submitFunc = async (values: T) => {
        const response = await taskOnSubmit(values, advancedOptions);
        if (response) {
            setBackendValidationError(response.message)
        } else {
            setBackendValidationError(undefined)
            await onSubmitSuccess(values)
            setAdvancedOptions(undefined)
            dialog.setOpen(false);
        }
    }

    const cancelForm = () => {
        setBackendValidationError(undefined)
        onCancel?.()
        dialog.setOpen(false)
        setAdvancedOptions(false)
    }

    return useObserver(() => {
        return (
            dialog.open &&
            <StyledDialog open={dialog.open}
                          onClose={() => dialog.setOpen(false)}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <ThemeProvider theme={formTheme}>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validate={(values) => validateFunc(
                            values,
                            advancedOptions
                        )}
                        onSubmit={submitFunc}>
                        {({
                            submitForm,
                            isSubmitting,
                            errors,
                            validateForm,
                            values
                        }) => (
                            <>
                                <DialogContent>
                                    <Form>
                                        <div className={dialogStyles.DialogRow} style={{marginBottom: '10px'}}>
                                            {backendValidationError &&
                                            <Alert severity="error" style={{width: '100%'}}>{backendValidationError}</Alert>}
                                        </div>
                                        <div className={dialogStyles.DialogRow}>
                                            <div
                                                className={wider ? dialogStyles.DialogColumnWider : dialogStyles.DialogColumnWide}>
                                                <div className={dialogStyles.DialogRow}>
                                                    <div className={dialogStyles.DialogColumn}>
                                                        {basicFields(errors).map((field, i) => (
                                                            <div key={i} style={{marginBottom: '10px'}}>
                                                                {field}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {advancedFields(errors).length > 0 &&
                                                <>
                                                    {advancedOptions &&
                                                    <>
                                                        <Divider/>
                                                        <div className={dialogStyles.DetailsSectionHeader}>Advanced
                                                            options
                                                        </div>
                                                        {advancedFields(errors).map((field, i) => (
                                                            <div key={i} style={{marginBottom: '10px'}}>
                                                                {field}
                                                            </div>
                                                        ))}
                                                    </>
                                                    }
                                                    <Divider/>
                                                    <Button size='small'
                                                            onClick={async () => {
                                                                setAdvancedOptions(!advancedOptions);
                                                                await validateForm(values)
                                                            }}>
                                                        {advancedOptions ? "Hide advanced options" : "Show advanced options"}
                                                    </Button>
                                                </>}
                                            </div>
                                        </div>
                                    </Form>
                                    {isSubmitting && <LinearProgress color="secondary"/>}
                                </DialogContent>
                                <DialogActions>
                                    <Button color="secondary" variant="contained" onClick={cancelForm}
                                            disabled={isSubmitting}>Cancel</Button>
                                    <Button color="secondary" variant="contained" onClick={submitForm}
                                            disabled={isSubmitting}>{submitButtonText}</Button>
                                </DialogActions>
                            </>
                        )}
                    </Formik>
                </ThemeProvider>
            </StyledDialog>
        )
    })

}
