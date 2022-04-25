import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ContentBox } from "./contentBox";
import { EnsureFetched } from "./ensureFetched";

export const TopicView = observer(() => {
  const { topics } = useStore();
  const params = useParams<"topic">();
  const topic = topics.topicsMap.get(params.topic);

  if (!topic?.name) {
    return null;
  }

  return (
    <EnsureFetched task={topic.fetchTask}>
      <ContentBox>
        <Outlet />
      </ContentBox>
    </EnsureFetched>
  );
});
