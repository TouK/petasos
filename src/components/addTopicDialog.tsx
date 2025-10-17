import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";
import { getTopicInitialData } from "./getTopicInitialData";
import { TopicDialog } from "./topicDialog";

export const AddTopicDialog = observer(() => {
    const { groups, dialogs } = useStore();
    const dialog = dialogs.topic;
    const initialValues = useCallback(
        (): TopicFormikValues => ({
            ...getTopicInitialData(groups),
            group: dialog.params?.group || groups.defaultGroup,
        }),
        [dialog.params?.group, groups.defaultGroup],
    );
    return <TopicDialog initialValues={initialValues} dialog={dialog} />;
});
