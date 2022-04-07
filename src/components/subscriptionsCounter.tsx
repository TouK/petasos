import { Chip, CircularProgress } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Topic } from "../store/topic";

export const SubscriptionsCounter = observer(({ topic }: { topic: Topic }) => {
  useEffect(() => {
    topic.fetchSubscriptionsTask();
  }, [topic]);

  return (
    <Chip
      size="small"
      color="secondary"
      label={
        topic.fetchSubscriptionsTask.resolved ? (
          `Subscriptions: ${topic.subscriptionsMap.size}`
        ) : (
          <CircularProgress size={15} />
        )
      }
    />
  );
});
