import { Dialog as MuiDialog, DialogContent, DialogTitle, LinearProgress, Stack } from "@mui/material";
import type { DialogProps } from "@mui/material/Dialog/Dialog";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { FormValues } from "../models";
import { Dialog } from "../store/dialog";
import { ValidationError } from "../store/topics";
import { BackendValidation } from "./backendValidation";
import { DialogActions } from "./dialogActions";
import { DialogFormFields } from "./dialogFormFields";

interface DialogTemplateComponentProps<T extends FormValues, R = void> extends Omit<DialogProps, "open" | "onClose"> {
    dialog: Dialog<unknown, R>;
    validateFunc: (FormValues, boolean) => void;
    taskOnSubmit: (values: T | Omit<T, "advancedValues">) => Promise<void | ValidationError>;
    onSubmitSuccess: (values: T | Omit<T, "advancedValues">) => Promise<R>;
    onCancel?: () => void;
    dialogTitle: string;
    submitButtonText: string;
    initialValues: T;
    basicFields: (FormikErrors) => JSX.Element[];
    advancedFields: (FormikErrors) => JSX.Element[];
    schemaInputField?: (FormikErrors) => JSX.Element;
}

function DialogTemplateComponent<T extends FormValues, R = void>(props: DialogTemplateComponentProps<T, R>) {
    const {
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
        schemaInputField,
        ...passProps
    } = props;
    const [backendValidationError, setBackendValidationError] = useState<string>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const submitFunc = async ({ advancedValues, ...otherValues }: T) => {
        const nextValues = showAdvanced ? { advancedValues, ...otherValues } : otherValues;

        try {
            const response = await taskOnSubmit(nextValues);
            if (response) {
                setBackendValidationError(response.message);
            } else {
                setBackendValidationError(null);
                const result = await onSubmitSuccess(nextValues);
                setShowAdvanced(false);
                dialog.close(result);
            }
        } catch (error) {
            setBackendValidationError(error);
        }
    };
    const cancelForm = () => {
        setBackendValidationError(null);
        onCancel?.();
        dialog.close();
        setShowAdvanced(false);
    };

    if (!dialog.isOpen) {
        return null;
    }

    return (
        <MuiDialog open={dialog.isOpen} onClose={() => dialog.close()} fullWidth {...passProps}>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validate={(values) => validateFunc(values, showAdvanced)}
                onSubmit={submitFunc}
            >
                {({ submitForm, isSubmitting, errors, validateForm, values }) => {
                    return (
                        <>
                            {isSubmitting && <LinearProgress color="secondary" />}
                            <DialogTitle>{dialogTitle}</DialogTitle>
                            <DialogContent>
                                <Form>
                                    <Stack spacing={2} my={1}>
                                        <BackendValidation text={backendValidationError} />
                                        <DialogFormFields
                                            basicFields={basicFields(errors).filter(Boolean)}
                                            schemaInputField={schemaInputField ? schemaInputField(errors) : null}
                                            showSchemaInput={values.contentType !== "JSON"}
                                            advancedFields={advancedFields(errors).filter(Boolean)}
                                            showAdvanced={showAdvanced}
                                            toggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                                            validateForm={() => validateForm(values)}
                                        />
                                    </Stack>
                                </Form>
                            </DialogContent>
                            <DialogActions
                                cancelForm={cancelForm}
                                isSubmitting={isSubmitting}
                                submitForm={submitForm}
                                submitButtonText={submitButtonText}
                            />
                        </>
                    );
                }}
            </Formik>
        </MuiDialog>
    );
}

export const DialogTemplate: typeof DialogTemplateComponent = observer(DialogTemplateComponent);
