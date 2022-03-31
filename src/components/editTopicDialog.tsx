import { FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";
import { Field, FormikErrors } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-mui";
import { useObserver } from "mobx-react-lite";
import React from "react";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";
import { ValidationError } from "../store/topics";
import { DEFAULT_TOPIC_VALUES } from "./addTopicDialog";
import { DialogTemplate } from "./dialogTemplate";
import { GroupsFormControl } from "./groupsFormControl";

export const EditTopicDialog = () => {
  const { dialogs, groups, topics } = useStore();

  return useObserver(() => {
    const validateFunc = (
      values: TopicFormikValues,
      includeAdvanced: boolean
    ) => {
      const errors: FormikErrors<TopicFormikValues> = {};
      const requiredFields = ["description", "schema"];
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
          errors.advancedValues.maxMessageSize = "Value must be integer";
        }
        if (!/^[0-9]*$/i.test(values.advancedValues.retentionTime.toString())) {
          if (!errors.advancedValues) {
            errors.advancedValues = {};
          }
          errors.advancedValues.retentionTime = "Value must be integer";
        }
      }
      return errors;
    };

    const taskOnSubmit = async (
      values: TopicFormikValues,
      includeAdvanced: boolean
    ): Promise<void | ValidationError> => {
      topics.selectedTopic.assignValuesFromForm(values, includeAdvanced);
      return topics.selectedTopic.putTask();
    };

    const onSubmitSuccess = async (): Promise<void> => {
      await groups.fetchTask();
      await topics.fetchTask();
    };

    const onCancel = (): void => {
      groups.changeDefaultGroup(undefined);
    };

    const initialValues: TopicFormikValues = topics.selectedTopic
      ? {
          advancedValues: {
            acknowledgement: topics.selectedTopic.ack,
            trackingEnabled: topics.selectedTopic.trackingEnabled,
            maxMessageSize: topics.selectedTopic.maxMessageSize,
            retentionTime: topics.selectedTopic.retentionTime.duration,
          },
          topic: topics.selectedTopic.name,
          schema: topics.selectedTopic.schemaWithoutMetadata,
          group: groups.groupOfSelectedTopic,
          description: topics.selectedTopic.description,
        }
      : {
          ...DEFAULT_TOPIC_VALUES,
          group: groups.defaultGroup,
        };

    const basicFields = (
      errors: FormikErrors<TopicFormikValues>
    ): JSX.Element[] => [
      groups.isGroupRemoveAllowed && (
        <GroupsFormControl
          key="group"
          errors={errors}
          groups={groups}
          disabled
        />
      ),
      <Field
        required
        component={TextField}
        label="Topic name"
        name="topic"
        key="topic"
        style={{ width: "100%" }}
        disabled
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
        dialog={dialogs.editTopic}
        dialogTitle={"Edit topic"}
        initialValues={initialValues}
        onCancel={onCancel}
        submitButtonText={"Update topic"}
        onSubmitSuccess={onSubmitSuccess}
        taskOnSubmit={taskOnSubmit}
        validateFunc={validateFunc}
        wider={true}
      />
    );
  });
};
