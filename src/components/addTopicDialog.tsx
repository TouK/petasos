import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import { getTopicData } from "../devData";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";
import { TopicDialog } from "./topicDialog";

export const DEFAULT_TOPIC_VALUES: TopicFormikValues = {
    advancedValues: {
        acknowledgement: "LEADER",
        trackingEnabled: false,
        maxMessageSize: 102400,
        retentionTime: 1,
    },
    topic: "",
    schema: "",
    group: "",
    description: "",
    contentType: "AVRO",
};

export const AddTopicDialog = observer(() => {
    const { groups, dialogs } = useStore();
    const dialog = dialogs.topic;
    const initialValues = useCallback(
        (): TopicFormikValues => ({
            ...DEFAULT_TOPIC_VALUES,
            group: dialog.params?.group || groups.defaultGroup,
            ...getTopicData(),
        }),
        [dialog.params?.group, groups.defaultGroup],
    );
    return <TopicDialog initialValues={initialValues} dialog={dialog} />;
});
