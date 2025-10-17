import { observer } from "mobx-react-lite";
import React from "react";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";

import { getTopicInitialData } from "./getTopicInitialData";
import { TopicDialog } from "./topicDialog";

export const AddClonedTopicDialog = observer(() => {
    const { groups, dialogs } = useStore();
    const dialog = dialogs.addClonedTopic;
    const { topic } = dialog.params;

    const initialValues = (): TopicFormikValues => ({
        ...getTopicInitialData(groups, topic),
    });

    return <TopicDialog initialValues={initialValues} dialog={dialog} />;
});
