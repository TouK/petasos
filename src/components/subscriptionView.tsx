import { observer } from "mobx-react-lite";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { EnsureFetched } from "./ensureFetched";
import { SubscriptionDetails } from "./subscriptionDetails";

export const SubscriptionView = observer(() => {
  const params = useParams<"subscription" | "topic">();
  return (
    <Subscription subscription={params.subscription} topic={params.topic} />
  );
});

const Subscription = observer(
  (props: { subscription: string; topic: string }) => {
    const { topics } = useStore();
    const topic = topics.topicsMap.get(props.topic);
    const subscription = topic.subscriptionsMap.get(props.subscription);
    return (
      <EnsureFetched task={topic.fetchSubscriptionsTask}>
        {topic && subscription && (
          <SubscriptionDetails topic={topic} subscription={subscription} />
        )}
      </EnsureFetched>
    );
  }
);
