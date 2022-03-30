import { Field, FormikErrors } from "formik";
import { TextField } from "formik-mui";
import { useObserver } from "mobx-react-lite";
import React from "react";
import { GroupFormValues } from "../models";
import { useStore } from "../store/storeProvider";
import { ValidationError } from "../store/topics";
import { DialogTemplate } from "./dialogTemplate";

export const AddGroupDialog = () => {
  const { dialogs, groups } = useStore();

  const basicFields = (): JSX.Element[] => [
    <Field
      required
      component={TextField}
      label="Group name"
      name="name"
      style={{ width: "100%" }}
    />,
  ];

  return useObserver(() => {
    const validateFunc = (values: GroupFormValues) => {
      const errors: FormikErrors<GroupFormValues> = {};
      if (!values.name) {
        errors.name = "Required";
      }
      return errors;
    };

    const taskOnSubmit = async (
      values: GroupFormValues,
      includeAdvanced: boolean
    ): Promise<void | ValidationError> => {
      if (!values.name) {
        console.error("Something went extremely wrong.");
        return;
      }
      return groups.addTask(values.name);
    };

    const onSubmitSuccess = async (values: GroupFormValues): Promise<void> => {
      await groups.fetchTask();
      groups.changeDefaultGroup(values.name);
    };

    const onCancel = (): void => {};

    const initialValues: GroupFormValues = {
      name: "",
      advancedValues: undefined,
    };

    return (
      <DialogTemplate<GroupFormValues>
        advancedFields={() => []}
        basicFields={basicFields}
        dialog={dialogs.group}
        dialogTitle={"Add new group"}
        initialValues={initialValues}
        onCancel={onCancel}
        submitButtonText={"Add group"}
        onSubmitSuccess={onSubmitSuccess}
        taskOnSubmit={taskOnSubmit}
        validateFunc={validateFunc}
        wider={false}
      />
    );
  });
};
