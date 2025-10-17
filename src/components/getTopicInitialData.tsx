import { TopicFormikValues } from "../models";
import { Groups } from "../store/groups";
import { Topic } from "../store/topic";
import { getRandomizedName } from "./getRandomizedName";

export const DEFAULT_TOPIC_VALUES: TopicFormikValues = {
    group: "",
    topic: "",
    description: "",
    contentType: "JSON",
    schema: `{
  "type": "record",
  "name": "message",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "text",
      "type": "string"
    },
    {
      "name": "value",
      "type": "int"
    }
  ]
}`,
    advancedValues: {
        acknowledgement: "LEADER",
        trackingEnabled: false,
        maxMessageSize: 102400,
        retentionTime: 1,
    },
};

export const getTopicInitialData = (groups: Groups, topic?: Topic): TopicFormikValues => {
    if (!topic) {
        return {
            ...DEFAULT_TOPIC_VALUES,
            group: groups.defaultGroup,
            topic: getRandomizedName(DEFAULT_TOPIC_VALUES.topic),
        };
    }

    return {
        group: groups.getGroupOfTopic(topic.name),
        topic: getRandomizedName(`${topic.displayName.replace(".", "_")}_`),
        description: topic.description,
        contentType: topic.contentType,
        schema: topic.schemaPrettified,
        advancedValues: {
            acknowledgement: topic.ack,
            trackingEnabled: topic.trackingEnabled,
            maxMessageSize: topic.maxMessageSize,
            retentionTime: topic.retentionTime.duration,
        },
    };
};
