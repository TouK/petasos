import { FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";
import { Field, FormikErrors } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-mui";
import { observer } from "mobx-react-lite";
import React from "react";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";
import { ValidationError } from "../store/topics";
import { DEFAULT_TOPIC_VALUES } from "./addTopicDialog";
import { DialogTemplate } from "./dialogTemplate";
import { JsonTextField } from "./jsonTextField";
import { GroupsFormControl } from "./groupsFormControl";
import { validateTopicForm } from "./validateTopicForm";

export const EditTopicDialog = observer(() => {
  const { dialogs, groups, topics } = useStore();
  const dialog = dialogs.editTopic;
  const { topic } = dialog.params;

  const taskOnSubmit = async (
    values: TopicFormikValues
  ): Promise<void | ValidationError> => {
    return topic.updateTask(values);
  };

  const onSubmitSuccess = async (): Promise<void> => {
    await groups.fetchTask();
    await topics.fetchTask();
  };

  const initialValues = (): TopicFormikValues =>
    topic
      ? {
          advancedValues: {
            acknowledgement: topic.ack,
            trackingEnabled: topic.trackingEnabled,
            maxMessageSize: topic.maxMessageSize,
            retentionTime: topic.retentionTime.duration,
          },
          topic: topic.displayName,
          schema: topic.schemaWithoutMetadata,
          group: groups.getGroupOfTopic(topic.name),
          description: topic.description,
        }
      : {
          ...DEFAULT_TOPIC_VALUES,
          group: groups.defaultGroup,
        };

  const basicFields = (
    errors: FormikErrors<TopicFormikValues>
  ): JSX.Element[] => [
    !groups.areGroupsHidden && (
      <GroupsFormControl key="group" errors={errors} disabled />
    ),
    <Field
      required
      component={TextField}
      label="Topic name"
      name="topic"
      key="topic"
      fullWidth
      disabled
    />,
    <Field
      required
      component={TextField}
      autoFocus
      label="Topic description"
      name="description"
      key="description"
      fullWidth
    />,
    <Field
      component={JsonTextField}
      label="Avro schema"
      name="schema"
      key="schema"
      id="schema"
      fullWidth
      variant="outlined"
      multiline
      rows={15}
    />,
  ];

  const advancedFields = (): JSX.Element[] => [
    <FormControl key="advancedValues.acknowledgement">
      <FormLabel>Acknowledgement</FormLabel>
      <Field component={RadioGroup} row name={"advancedValues.acknowledgement"}>
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
      dialogTitle={"Edit topic"}
      initialValues={initialValues()}
      submitButtonText={"Update topic"}
      onSubmitSuccess={onSubmitSuccess}
      taskOnSubmit={taskOnSubmit}
      validateFunc={validateTopicForm}
      wider={true}
    />
  );
});
