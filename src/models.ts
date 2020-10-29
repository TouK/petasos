import {FormikValues} from "formik";

export interface TopicModel {
    name: string;
    description: string;
    owner: OwnerModel;
    retentionTime: RetentionTimeModel;
    jsonToAvroDryRun: boolean;
    ack: string;
    trackingEnabled: boolean;
    migratedFromJsonType: boolean;
    schemaIdAwareSerializationSchemaEnabled: boolean;
    contentType: string;
    maxMessageSize: number;
    auth: AuthModel;
    subscribingRestricted: boolean;
    offlineStorage: TopicDataOfflineStorageModel;
    createdAt: number;
    modifiedAt: number;
    schema: string;
}

export interface OwnerModel {
    source: string;
    id: string;
}

export interface RetentionTimeModel {
    duration: number;
    infinite: boolean;
}

export interface AuthModel {
    enabled: boolean;
    unauthenticatedAccessEnabled: boolean;
    publishers: string[];
}

export interface TopicDataOfflineStorageModel {
    enabled: boolean;
    retentionTime: RetentionTimeModel;
}

export interface MessagePreviewModel {
    content: string;
    truncated: boolean;
}

export interface SubscriptionModel {
    topicName: string;
    contentType: string;
    deliveryType: string;
    description: string;
    endpoint: string;
    mode: string;
    monitoringDetails: MonitoringDetailsModel;
    name: string;
    owner: OwnerModel
    state: string;
    subscriptionPolicy: SubscriptionPolicyModel;
    trackingEnabled: boolean;
    trackingMode: string;
    http2Enabled: boolean;
    subscriptionIdentityHeadersEnabled: boolean;
    createdAt: number;
    modifiedAt: number;
    // TODO: filters in fact are more complex (see https://hermes-pubsub.readthedocs.io/en/latest/user/subscribing/#message-filtering),
    // but for now are ignored in the UI
    filters: string[];
    // TODO: headers should have structure {"name": string, "value": string} and be added to the form
    headers: string[];
}

export interface MonitoringDetailsModel {
    reaction: string;
    severity: string;
}

export interface SubscriptionPolicyModel {
    backoffMaxIntervalInSec: number;
    backoffMultiplier: number;
    messageBackoff: number;
    messageTtl: number;
    rate: number;
    requestTimeout: number;
    socketTimeout: number;
    inflightSize: number;
    sendingDelay: number;
    retryClientErrors: boolean;
    backoffMaxIntervalMillis: number;

}

export interface SubscriptionMetrics {
    delivered: number,
    discarded: number,
    inflight: number,
    timeouts: string,
    otherErrors: string,
    codes2xx: string,
    codes4xx: string,
    codes5xx: string,
    rate: string,
    lag: string
}

export interface UndeliveredMessage {
    timestamp: number,
    subscription: string,
    topicName: string,
    status: string,
    reason: string,
    message: string,
    partition: number,
    offset: number,
    cluster: string,
    messageId: string
}

export interface FormValues {
    advancedValues: FormikValues | void
}

export class TopicFormikValues implements FormValues{
    topic: string;
    schema: string;
    group: string;
    description: string;
    advancedValues: AdvancedTopicFormikValues;
}

export class AdvancedTopicFormikValues implements FormikValues {
    acknowledgement: string; // LEADER | ALL
    retentionTime: number;
    trackingEnabled: boolean;
    maxMessageSize: number;

}

export class SubscriptionFormikValues implements FormValues {
    name: string;
    endpoint: string;
    description: string;
    advancedValues: AdvancedSubscriptionFormikValues;
}

export class AdvancedSubscriptionFormikValues implements FormikValues {
    mode: string = 'ANYCAST';
    rate: number = 100;
    sendingDelay: number = 0;
    messageTtl: number = 3600;
    trackingMode: string = "trackingOff";
    retryClientErrors: boolean = false;
    messageBackoff: number = 1000;
    backoffMultiplier: number = 1;
    backoffMaxIntervalInSec: number = 600;
}

export class GroupFormValues implements FormValues {
    name: string;
    advancedValues: void = null;
}