import { Chip, CircularProgress } from "@mui/material";
import { useObserver } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Topic } from "../store/topic";

export const SubscriptionsCounter = ({ topic }: { topic: Topic }) => {
  return useObserver(() => {
    useEffect(() => {
      topic.fetchSubscriptionsTask();
    }, []);

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
};
