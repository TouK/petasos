import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
} from "@mui/material";
import { Field, FormikErrors } from "formik";
import { CheckboxWithLabel, RadioGroup, Select, TextField } from "formik-mui";
import { useObserver } from "mobx-react-lite";
import React from "react";
import { TopicFormikValues } from "../models";
import { Dialog } from "../store/dialog";
import { useStore } from "../store/storeProvider";
import { Topic } from "../store/topic";
import { ValidationError } from "../store/topics";
import dialogStyles from "../styles/dialog.css";
import { DialogTemplate } from "./dialogTemplate";
import { StyledButton } from "./styledMuiComponents";

export const TopicDialog = ({
  initialValues,
  dialog,
}: {
  initialValues: TopicFormikValues;
  dialog: Dialog;
}) => {
  const { dialogs, groups, topics } = useStore();

  return useObserver(() => {
    const validateFunc = (
      values: TopicFormikValues,
      includeAdvanced: boolean
    ) => {
      const errors: FormikErrors<TopicFormikValues> = {};
      if (!values.topic) {
        errors.topic = "Required";
      } else if (values.topic.split(".").length > 1) {
        errors.topic = "Name cannot contain '.'";
      } else if (!/^[a-zA-Z0-9_.-]+$/i.test(values.topic)) {
        errors.topic = "Invalid topic name";
      }
      const requiredFields = ["description", "schema", "group"];
      requiredFields.forEach((field) => {
        if (!values[field]) {
          errors[field] = "Required";
        }
      });

      if (includeAdvanced) {
        if (
          !/^[0-9]*$/i.test(values.advancedValues.maxMessageSize.toString())
        ) {
          if (!errors.advancedValues) {
            errors.advancedValues = {};
          }
          errors.advancedValues.maxMessageSize =
            "Value must be positive integer";
        }
        if (!/^[0-9]*$/i.test(values.advancedValues.retentionTime.toString())) {
          if (!errors.advancedValues) {
            errors.advancedValues = {};
          }
          errors.advancedValues.retentionTime =
            "Value must be positive integer";
        }
      }
      return errors;
    };

    const taskOnSubmit = async (
      values: TopicFormikValues,
      includeAdvanced: boolean
    ): Promise<void | ValidationError> => {
      const topic: Topic = new Topic(values.group + "." + values.topic);
      topic.assignValuesFromForm(values, includeAdvanced);
      return topics.postTask(topic);
    };

    const onSubmitSuccess = async (
      values: TopicFormikValues
    ): Promise<void> => {
      await groups.fetchTask();
      await topics.fetchTask();
      groups.changeSelectedGroup(values.group);
      topics.changeSelectedTopic(`${values.group}.${values.topic}`);
    };

    const onCancel = (): void => {
      groups.changeDefaultGroup(undefined);
    };

    const GroupField = (errors: FormikErrors<TopicFormikValues>) => (
      <div className={dialogStyles.DialogRow}>
        <div className={dialogStyles.DialogColumn}>
          <Field
            component={Select}
            formControl={{ fullWidth: true }}
            formHelperText={{ children: errors.group }}
            required
            name="group"
            label="Group"
            labelId="demo-simple-select-label"
          >
            {groups.names.map((groupName) => (
              <MenuItem value={groupName} key={groupName}>
                {groupName}
              </MenuItem>
            ))}
          </Field>
        </div>
        <div className={dialogStyles.DialogColumn}>
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={() => dialogs.group.setOpen(true)}
          >
            Create new group
          </StyledButton>
        </div>
      </div>
    );

    const basicFields = (
      errors: FormikErrors<TopicFormikValues>
    ): JSX.Element[] => [
      GroupField(errors),
      <Field
        required
        component={TextField}
        label="Topic name"
        name="topic"
        style={{ width: "100%" }}
      />,
      <Field
        required
        component={TextField}
        label="Topic description"
        name="description"
        style={{ width: "100%" }}
      />,
      <Field
        component={TextField}
        label="Avro schema"
        name="schema"
        id="schema"
        style={{ width: "100%" }}
        variant="outlined"
        multiline
        rows={15}
      />,
    ];

    const advancedFields = (
      errors: FormikErrors<TopicFormikValues>
    ): JSX.Element[] => [
      <FormControl>
        <FormLabel>Acknowledgement</FormLabel>
        <Field
          component={RadioGroup}
          row
          name={"advancedValues.acknowledgement"}
        >
          <FormControlLabel value="LEADER" control={<Radio />} label="LEADER" />
          <FormControlLabel value="ALL" control={<Radio />} label="ALL" />
        </Field>
      </FormControl>,
      <Field
        component={CheckboxWithLabel}
        Label={{ label: "Tracking enabled" }}
        name="advancedValues.trackingEnabled"
        type="checkbox"
      />,
      <Field
        component={TextField}
        label="Max message size (bytes)"
        name="advancedValues.maxMessageSize"
        style={{ width: "100%" }}
      />,
      <Field
        component={TextField}
        label="Retention time (days)"
        name="advancedValues.retentionTime"
        style={{ width: "100%" }}
      />,
    ];

    return (
      <DialogTemplate<TopicFormikValues>
        advancedFields={advancedFields}
        basicFields={basicFields}
        dialog={dialog}
        dialogTitle={"Add new topic"}
        initialValues={initialValues}
        onCancel={onCancel}
        submitButtonText={"Add topic"}
        onSubmitSuccess={onSubmitSuccess}
        taskOnSubmit={taskOnSubmit}
        validateFunc={validateFunc}
        wider={true}
      />
    );
  });
};
