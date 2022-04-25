import { observer } from "mobx-react-lite";
import React from "react";
import { getTopicData } from "../devData";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";
import { TopicDialog } from "./topicDialog";

export const DEFAULT_TOPIC_VALUES: TopicFormikValues = {
  advancedValues: {
    acknowledgement: "LEADER",
    trackingEnabled: false,
    maxMessageSize: 10240,
    retentionTime: 1,
  },
  topic: "",
  schema: "",
  group: "",
  description: "",
};

export const AddTopicDialog = observer(() => {
  const { groups, dialogs } = useStore();
  const dialog = dialogs.topic;
  const initialValues = (): TopicFormikValues => ({
    ...DEFAULT_TOPIC_VALUES,
    group: dialog.params?.group || groups.defaultGroup,
    ...getTopicData(),
  });
  return <TopicDialog initialValues={initialValues} dialog={dialog} />;
});
