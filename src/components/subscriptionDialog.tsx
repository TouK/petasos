import { FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";
import { Field, FormikErrors } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-mui";
import { observer, useObserver } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AdvancedSubscriptionFormikValues,
  SubscriptionFormikValues,
} from "../models";
import { Dialog } from "../store/dialog";
import { useStore } from "../store/storeProvider";
import { Subscription } from "../store/subscription";
import { ValidationError } from "../store/topics";
import { DialogTemplate } from "./dialogTemplate";

export const SubscriptionDialog = ({
  isEdit,
  dialogTitle,
  submitButtonText,
  initialValues,
  dialog,
  taskOnSubmit,
}: {
  isEdit: boolean;
  dialogTitle: string;
  submitButtonText: string;
  initialValues: SubscriptionFormikValues;
  dialog: Dialog<unknown>;
  taskOnSubmit: (SubscriptionFormikValues) => Promise<void | ValidationError>;
}) => {
  const { groups, topics } = useStore();

  const validateFunc = (
    values: SubscriptionFormikValues,
    includeAdvanced: boolean
  ) => {
    const errors: FormikErrors<SubscriptionFormikValues> = {};
    if (!values.endpoint) {
      errors.endpoint = "Required";
    } else if (
      !new RegExp(
        "([a-zA-Z0-9]*)://(([a-zA-Z0-9\\.\\~\\-\\_]*):(.*)@)?(.*)"
      ).test(values.endpoint)
    ) {
      errors.endpoint = "Invalid endpoint";
    }
    const requiredFields = ["name", "description"];
    requiredFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = "Required";
      }
    });
    if (includeAdvanced) {
      const numericVals = [
        "rate",
        "sendingDelay",
        "messageTtl",
        "messageBackoff",
        "backoffMultiplier",
        "backoffMaxIntervalInSec",
      ];
      numericVals.forEach((key) => {
        if (!/^[0-9]*$/i.test(values.advancedValues[key])) {
          if (!errors.advancedValues) {
            errors.advancedValues = {};
          }
          errors.advancedValues[key] = "Value must be positive integer";
        }
      });
    }
    return errors;
  };

  const basicFields = (): JSX.Element[] => [
    <Field
      required
      component={TextField}
      label="Subscription name"
      name="name"
      key="name"
      style={{ width: "100%" }}
      disabled={isEdit}
    />,
    <Field
      required
      component={TextField}
      label="Endpoint"
      name="endpoint"
      key="endpoint"
      style={{ width: "100%" }}
    />,
    <Field
      required
      component={TextField}
      label="Description"
      name="description"
      key="description"
      style={{ width: "100%" }}
    />,
  ];

  const advancedFields = (): JSX.Element[] => [
    <FormControl key="advancedValues.mode">
      <FormLabel>Mode</FormLabel>
      <Field component={RadioGroup} row name={"advancedValues.mode"}>
        <FormControlLabel value="ANYCAST" control={<Radio />} label="ANYCAST" />
        <FormControlLabel
          value="BROADCAST"
          control={<Radio />}
          label="BROADCAST"
        />
      </Field>
    </FormControl>,
    <Field
      component={TextField}
      label="Rate limit (messages/second)"
      name="advancedValues.rate"
      key="advancedValues.rate"
      style={{ width: "100%" }}
    />,
    <Field
      component={TextField}
      label="Sending delay (milliseconds)"
      name="advancedValues.sendingDelay"
      key="advancedValues.sendingDelay"
      style={{ width: "100%" }}
    />,
    <Field
      component={TextField}
      label="Message TTL (seconds)"
      name="advancedValues.messageTtl"
      key="advancedValues.messageTtl"
      style={{ width: "100%" }}
    />,
    <Field
      component={CheckboxWithLabel}
      Label={{ label: "Retry on 4xx status" }}
      name="advancedValues.retryClientErrors"
      key="advancedValues.retryClientErrors"
      type="checkbox"
    />,
    <Field
      component={TextField}
      label="Retry backoff (milliseconds)"
      name="advancedValues.messageBackoff"
      key="advancedValues.messageBackoff"
      style={{ width: "100%" }}
    />,
    <Field
      component={TextField}
      label="Retry backoff multiplier"
      name="advancedValues.backoffMultiplier"
      key="advancedValues.backoffMultiplier"
      style={{ width: "100%" }}
    />,
    <Field
      component={TextField}
      label="Retry backoff maximal interval (seconds)"
      name="advancedValues.backoffMaxIntervalInSec"
      key="advancedValues.backoffMaxIntervalInSec"
      style={{ width: "100%" }}
    />,
    <FormControl key="advancedValues.trackingMode">
      <FormLabel>Tracking mode</FormLabel>
      <Field component={RadioGroup} row name={"advancedValues.trackingMode"}>
        <FormControlLabel
          value="trackingOff"
          control={<Radio />}
          label="No tracking"
        />
        <FormControlLabel
          value="discardedOnly"
          control={<Radio />}
          label="Track message discarding only"
        />
        <FormControlLabel
          value="trackingAll"
          control={<Radio />}
          label="Track everything"
        />
      </Field>
    </FormControl>,
  ];

  return useObserver(() => {
    const onSubmitSuccess = async (): Promise<void> => {
      await groups.fetchTask();
      await topics.fetchTask();
    };

    return (
      <DialogTemplate<SubscriptionFormikValues>
        advancedFields={advancedFields}
        basicFields={basicFields}
        dialog={dialog}
        submitButtonText={submitButtonText}
        dialogTitle={dialogTitle}
        initialValues={initialValues}
        onSubmitSuccess={onSubmitSuccess}
        taskOnSubmit={taskOnSubmit}
        validateFunc={validateFunc}
        wider={true}
      />
    );
  });
};

const getDefaultSubscriptionValues = () => ({
  name: "",
  endpoint: "",
  description: "",
  advancedValues: new AdvancedSubscriptionFormikValues(),
});

export const AddSubscriptionDialog = observer(() => {
  const { dialogs } = useStore();
  const dialog = dialogs.subscription;
  const { topic } = dialog.params;
  const initialValues = getDefaultSubscriptionValues;

  const taskOnSubmit = async (
    values: SubscriptionFormikValues
  ): Promise<void | ValidationError> => {
    const sub: Subscription = new Subscription(values.name, topic);
    sub.assignValuesFromForm(values);
    await topic.postSubscriptionTask(sub);
    await topic.fetchSubscriptionsTask();
  };
  return (
    <SubscriptionDialog
      isEdit={false}
      dialogTitle={`Add new subscription to topic ${topic?.name}`}
      submitButtonText={"Add subscription"}
      initialValues={initialValues()}
      dialog={dialog}
      taskOnSubmit={taskOnSubmit}
    />
  );
});

export const AddClonedSubscriptionDialog = observer(() => {
  const { dialogs } = useStore();
  const dialog = dialogs.addClonedSubscription;
  const { topic, subscription } = dialog.params;

  const initialValues = (): SubscriptionFormikValues =>
    subscription
      ? {
          ...subscription.toForm,
          name: "",
        }
      : getDefaultSubscriptionValues();

  const navigate = useNavigate();
  const taskOnSubmit = async (
    values: SubscriptionFormikValues
  ): Promise<void | ValidationError> => {
    const sub: Subscription = new Subscription(values.name, topic);
    sub.assignValuesFromForm(values);
    await topic.postSubscriptionTask(sub);
    await topic.fetchSubscriptionsTask();
    navigate(`/${topic.name}/${values.name}`);
  };

  return (
    <SubscriptionDialog
      isEdit={false}
      dialogTitle={`Add new subscription to topic ${topic?.name}`}
      submitButtonText={"Add subscription"}
      initialValues={initialValues()}
      dialog={dialog}
      taskOnSubmit={taskOnSubmit}
    />
  );
});

export const EditSubscriptionDialog = observer(() => {
  const { dialogs } = useStore();
  const dialog = dialogs.editSubscription;
  const { topic, subscription } = dialog.params;

  const initialValues = (): SubscriptionFormikValues =>
    subscription ? subscription.toForm : getDefaultSubscriptionValues();

  const taskOnSubmit = async (
    values: SubscriptionFormikValues
  ): Promise<void | ValidationError> => {
    subscription.assignValuesFromForm(values);
    return subscription.putTask();
  };

  return (
    <SubscriptionDialog
      isEdit={true}
      dialogTitle={`Edit subscription to topic ${topic?.name}`}
      submitButtonText={"Update subscription"}
      initialValues={initialValues()}
      dialog={dialog}
      taskOnSubmit={taskOnSubmit}
    />
  );
});
