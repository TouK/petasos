import { Alert } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useObserver } from "mobx-react-lite";
import React, { useState } from "react";
import { FormValues } from "../models";
import { Dialog } from "../store/dialog";
import { useStore } from "../store/storeProvider";
import { ValidationError } from "../store/topics";
import dialogStyles from "../styles/dialog.css";
import { StyledDialog } from "./styledMuiComponents";

export const DialogTemplate = <T extends FormValues, R = void>({
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
  wider,
}: {
  dialog: Dialog<unknown, R>;
  validateFunc: (FormValues, boolean) => void;
  taskOnSubmit: (
    values: T | Omit<T, "advancedValues">
  ) => Promise<void | ValidationError>;
  onSubmitSuccess: (values: T | Omit<T, "advancedValues">) => Promise<R>;
  onCancel?: () => void;
  dialogTitle: string;
  submitButtonText: string;
  initialValues: T;
  basicFields: (FormikErrors) => JSX.Element[];
  advancedFields: (FormikErrors) => JSX.Element[];
  wider: boolean;
}) => {
  const { options } = useStore();
  const [backendValidationError, setBackendValidationError] =
    useState(undefined);
  const [advancedOptions, setAdvancedOptions] = useState(false);

  return useObserver(() => {
    const submitFunc = async ({ advancedValues, ...otherValues }: T) => {
      const nextValues = advancedOptions
        ? { advancedValues, ...otherValues }
        : otherValues;
      const response = await taskOnSubmit(nextValues);
      if (response) {
        setBackendValidationError(response.message);
      } else {
        setBackendValidationError(undefined);
        const result = await onSubmitSuccess(nextValues);
        setAdvancedOptions(false);
        dialog.close(result);
      }
    };
    const cancelForm = () => {
      setBackendValidationError(undefined);
      onCancel?.();
      dialog.close();
      setAdvancedOptions(false);
    };

    if (!dialog.isOpen) {
      return null;
    }

    return (
      <StyledDialog open={dialog.isOpen} onClose={() => dialog.close()}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validate={(values) => validateFunc(values, advancedOptions)}
          onSubmit={submitFunc}
        >
          {({ submitForm, isSubmitting, errors, validateForm, values }) => {
            const advanced = options.allowAdvancedFields
              ? advancedFields(errors).filter(Boolean)
              : [];
            return (
              <>
                {isSubmitting && <LinearProgress color="secondary" />}
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                  <Form>
                    <div
                      className={dialogStyles.DialogRow}
                      style={{ marginBottom: "10px" }}
                    >
                      {backendValidationError && (
                        <Alert severity="error" style={{ width: "100%" }}>
                          {backendValidationError}
                        </Alert>
                      )}
                    </div>
                    <div className={dialogStyles.DialogRow}>
                      <div
                        className={
                          wider
                            ? dialogStyles.DialogColumnWider
                            : dialogStyles.DialogColumnWide
                        }
                      >
                        <div className={dialogStyles.DialogRow}>
                          <div className={dialogStyles.DialogColumn}>
                            {basicFields(errors)
                              .filter(Boolean)
                              .map((field, i) => (
                                <div key={i} style={{ marginBottom: "10px" }}>
                                  {field}
                                </div>
                              ))}
                          </div>
                        </div>
                        {advanced.length > 0 && (
                          <>
                            {advancedOptions && (
                              <>
                                <Divider />
                                <div
                                  className={dialogStyles.DetailsSectionHeader}
                                >
                                  Advanced options
                                </div>
                                {advanced.map((field, i) => (
                                  <div key={i} style={{ marginBottom: "10px" }}>
                                    {field}
                                  </div>
                                ))}
                              </>
                            )}
                            <Divider />
                            <Button
                              size="small"
                              onClick={async () => {
                                setAdvancedOptions(!advancedOptions);
                                await validateForm(values);
                              }}
                            >
                              {advancedOptions
                                ? "Hide advanced options"
                                : "Show advanced options"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Form>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={cancelForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={submitForm}
                    disabled={isSubmitting}
                  >
                    {submitButtonText}
                  </Button>
                </DialogActions>
              </>
            );
          }}
        </Formik>
      </StyledDialog>
    );
  });
};
