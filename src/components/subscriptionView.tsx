import { observer } from "mobx-react-lite";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { EnsureFetched } from "./ensureFetched";
import { SubscriptionDetails } from "./subscriptionDetails";

const Subscription = observer((props: { subscriptionName: string; topicName: string }) => {
    const { subscriptionName, topicName } = props;
    const { topics } = useStore();
    const topic = topics.getByName(topicName);
    const subscription = topic.subscriptionsMap.get(subscriptionName);
    return (
        <EnsureFetched task={topic.fetchSubscriptionsTask}>
            {topic && subscription && <SubscriptionDetails topic={topic} subscription={subscription} />}
        </EnsureFetched>
    );
});

const SubscriptionView = observer(() => {
    const { subscription, topic } = useParams<"subscription" | "topic">();
    return <Subscription subscriptionName={subscription} topicName={topic} />;
});

export default SubscriptionView;
