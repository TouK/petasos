import { Field, FormikErrors } from "formik";
import { TextField } from "formik-mui";
import { useObserver } from "mobx-react-lite";
import React from "react";
import { getGroupData } from "../devData";
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
      key="name"
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
      values: GroupFormValues
    ): Promise<void | ValidationError> => {
      if (!values.name) {
        console.error("Something went extremely wrong.");
        return;
      }
      return groups.addTask(values.name);
    };

    const onSubmitSuccess = async (
      values: GroupFormValues
    ): Promise<string> => {
      await groups.fetchTask();
      return values.name;
    };

    const initialValues = (): GroupFormValues => ({
      name: "",
      ...getGroupData(),
    });

    const dialog = dialogs.group;
    return (
      <DialogTemplate<GroupFormValues, string>
        advancedFields={() => []}
        basicFields={basicFields}
        dialog={dialog}
        dialogTitle={"Add new group"}
        initialValues={initialValues()}
        submitButtonText={"Add group"}
        onSubmitSuccess={onSubmitSuccess}
        taskOnSubmit={taskOnSubmit}
        validateFunc={validateFunc}
        maxWidth="xs"
      />
    );
  });
};
