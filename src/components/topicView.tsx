import { observer } from "mobx-react-lite";
import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ContentBox } from "./contentBox";
import { EnsureFetched } from "./ensureFetched";

const Topic = observer(({ topicName }: { topicName: string }) => {
    const { topics } = useStore();
    const topic = topics.getByName(topicName);

    if (!topic?.name) {
        return topics.fetchTask.resolved ? <Navigate to="/" /> : null;
    }

    return (
        <EnsureFetched task={topic.fetchTask}>
            <ContentBox>
                <Outlet />
            </ContentBox>
        </EnsureFetched>
    );
});

const TopicView = observer(() => {
    const { topic } = useParams<"topic">();
    return <Topic topicName={topic} />;
});

export default TopicView;
