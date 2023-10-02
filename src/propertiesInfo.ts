// These classes contain information (copy-pasted from original Hermes UI) about properties,
// they're displayed in forms and sub/topic detail views

export const SubscriptionInfo = {
    deliveryType:
        'Maximum rate defined by user (per data center). Maximum rate calculated by algorithm can be observed in "Output rate" metric.',
    mode: "Hermes can deliver messages in ANYCAST (to one of subscribed hosts) or in BROADCAST (to all subscribed hosts) mode.",
    metrics: {
        latency: "Latency of acknowledging messages by subscribing service as measured by Hermes.",
        lag: 'Total number of events waiting to be delivered. Each subscription has a "natural" lag, which depends on production rate.',
        outputRate:
            "Maximum sending rate calculated based on receiving service performance. For well-performing service output rate should be equal to rate limit.",
    },
    subscriptionPolicy: {
        rate: 'Maximum rate defined by user (per data center). Maximum rate calculated by algorithm can be observed in "Output rate" metric.',
        batchSize: "Desired number of messages in a single batch.",
        batchTime: "Max time between arrival of first message to batch delivery attempt.",
        batchVolume: "Desired number of bytes in single batch.",
        requestTimeout: "Max time for processing message by subscriber.",
        sendingDelay:
            "Amount of time in ms after which an event will be send. Useful if events from two topics are sent at the same time and you want to increase chance that events from one topic will be deliver after events from other topic.",
        messageTtl:
            "Amount of time a message can be held in sending queue and retried. If message will not be delivered during this time, it will be discarded.",
        retryClientErrors: "If false, message will not be retried when service responds with 4xx status (i.e. Bad Request).",
        messageBackoff: "Minimum amount of time between consecutive message retries.",
        backoffMultiplier: "Delay multiplier between consecutive send attempts of failed requests",
        backoffMaxIntervalInSec: "Maximum value of delay backoff when using exponential calculation",
    },
    monitoringDetails: {
        severity: "How important should be the subscription's health for the monitoring.",
        reaction: "Information for monitoring how to react when the subscription becomes unhealthy (e.g. team name or Pager Duty ID).",
        http2Enabled: "If true Hermes will deliver messages using http/2 protocol.",
    },
};

export const TopicInfo = {
    retentionTime: {
        duration: "For how many days message is available for subscribers after being published.",
    },
    ack: 'Specifies the strength of guarantees that acknowledged message was indeed persisted. In "Leader" mode ACK is required only from topic leader, which is fast and gives 99.99999% guarantee. It might be not enough when cluster is unstable. "All" mode means message needs to be saved on all replicas before sending ACK, which is quite slow but gives 100% guarantee that message has been persisted.',
};
