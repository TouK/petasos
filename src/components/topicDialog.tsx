import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
} from "@mui/material";
import { Field, FormikErrors } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-mui";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TopicFormikValues } from "../models";
import { Dialog } from "../store/dialog";
import { useStore } from "../store/storeProvider";
import { Topic } from "../store/topic";
import { DialogTemplate } from "./dialogTemplate";
import { GroupsFormControl } from "./groupsFormControl";

export const TopicDialog = observer(
  ({
    initialValues,
    dialog,
  }: {
    initialValues: () => TopicFormikValues;
    dialog: Dialog<{ topic: Topic }>;
  }) => {
    const store = useStore();
    const { dialogs, groups, topics } = store;

    const validateFunc = (
      values: TopicFormikValues,
      includeAdvanced: boolean
    ) => {
      const errors: FormikErrors<TopicFormikValues> = {};
      if (!values.topic) {
        errors.topic = "Required";
      } else if (Topic.splitName(values.topic).length > 1) {
        errors.topic = `Name cannot contain "${Topic.GROUP_NAME_SEPARATOR}"`;
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

    const taskOnSubmit = (values) => Topic.create(values, store);

    const navigate = useNavigate();

    const onSubmitSuccess = async ({
      group,
      topic,
    }: TopicFormikValues): Promise<void> => {
      await groups.fetchTask();
      await topics.fetchTask();
      const topicName = Topic.joinName(group, topic);
      navigate(`/${topicName}`);
    };

    const basicFields = (
      errors: FormikErrors<TopicFormikValues>
    ): JSX.Element[] => [
      !groups.areGroupsHidden && (
        <GroupsFormControl
          key="group"
          errors={errors}
          addButton={
            groups.isGroupAddAllowed && (
              <Box display="flex" alignItems="stretch">
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() => dialogs.group.open()}
                >
                  Create new group
                </Button>
              </Box>
            )
          }
        />
      ),
      <Field
        required
        component={TextField}
        label="Topic name"
        name="topic"
        key="topic"
        style={{ width: "100%" }}
      />,
      <Field
        required
        component={TextField}
        label="Topic description"
        name="description"
        key="description"
        style={{ width: "100%" }}
      />,
      <Field
        component={TextField}
        label="Avro schema"
        name="schema"
        key="schema"
        id="schema"
        style={{ width: "100%" }}
        variant="outlined"
        multiline
        rows={15}
      />,
    ];

    const advancedFields = (): JSX.Element[] => [
      <FormControl key="advancedValues.acknowledgement">
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
        key="advancedValues.trackingEnabled"
        type="checkbox"
      />,
      <Field
        component={TextField}
        label="Max message size (bytes)"
        name="advancedValues.maxMessageSize"
        key="advancedValues.maxMessageSize"
        style={{ width: "100%" }}
      />,
      <Field
        component={TextField}
        label="Retention time (days)"
        name="advancedValues.retentionTime"
        key="advancedValues.retentionTime"
        style={{ width: "100%" }}
      />,
    ];

    return (
      <DialogTemplate<TopicFormikValues>
        advancedFields={advancedFields}
        basicFields={basicFields}
        dialog={dialog}
        dialogTitle={"Add new topic"}
        initialValues={initialValues()}
        submitButtonText={"Add topic"}
        onSubmitSuccess={onSubmitSuccess}
        taskOnSubmit={taskOnSubmit}
        validateFunc={validateFunc}
        wider={true}
      />
    );
  }
);
