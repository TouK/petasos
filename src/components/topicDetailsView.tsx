import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { TopicDetails } from "./topicDetails";

const TopicDetailsView = observer(() => {
    const { topics } = useStore();
    const { topic: topicName } = useParams<"topic">();

    return <TopicDetails topic={topics.getByName(topicName)} />;
});

export default TopicDetailsView;
