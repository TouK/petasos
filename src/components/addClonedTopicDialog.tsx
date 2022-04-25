import { observer } from "mobx-react-lite";
import React from "react";
import { getTopicData } from "../devData";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";
import { DEFAULT_TOPIC_VALUES } from "./addTopicDialog";
import { TopicDialog } from "./topicDialog";

export const AddClonedTopicDialog = observer(() => {
  const { groups, dialogs } = useStore();
  const dialog = dialogs.addClonedTopic;
  const { topic } = dialog.params;

  const initialValues = (): TopicFormikValues =>
    topic
      ? {
          advancedValues: {
            acknowledgement: topic.ack,
            trackingEnabled: topic.trackingEnabled,
            maxMessageSize: topic.maxMessageSize,
            retentionTime: topic.retentionTime.duration,
          },
          topic: "",
          schema: topic.schemaWithoutMetadata,
          group: groups.getGroupOfTopic(topic.name),
          description: topic.description,
          ...getTopicData(topic),
        }
      : {
          ...DEFAULT_TOPIC_VALUES,
          group: groups.defaultGroup,
        };

  return <TopicDialog initialValues={initialValues} dialog={dialog} />;
});
