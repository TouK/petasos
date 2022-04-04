import { FormikValues } from "formik";

export interface TopicModel {
  name: string;
  description: string;
  owner: OwnerModel;
  retentionTime: RetentionTimeModel;
  jsonToAvroDryRun: boolean;
  ack: Acknowledgement;
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
  owner: OwnerModel;
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
  delivered: number;
  discarded: number;
  inflight: number;
  timeouts: string;
  otherErrors: string;
  codes2xx: string;
  codes4xx: string;
  codes5xx: string;
  rate: string;
  lag: string;
}

export interface UndeliveredMessage {
  timestamp: number;
  subscription: string;
  topicName: string;
  status: string;
  reason: string;
  message: string;
  partition: number;
  offset: number;
  cluster: string;
  messageId: string;
}

export interface FormValues<T extends FormikValues = FormikValues> {
  advancedValues?: T;
}

export interface TopicFormikValues
  extends FormValues<AdvancedTopicFormikValues> {
  topic: string;
  schema: string;
  group: string;
  description: string;
}

export type Acknowledgement = "LEADER" | "ALL";

export interface AdvancedTopicFormikValues extends FormikValues {
  acknowledgement: Acknowledgement;
  retentionTime: number;
  trackingEnabled: boolean;
  maxMessageSize: number;
}

export interface SubscriptionFormikValues
  extends FormValues<AdvancedSubscriptionFormikValues> {
  name: string;
  endpoint: string;
  description: string;
}

export class AdvancedSubscriptionFormikValues implements FormikValues {
  mode = "ANYCAST";
  rate = 100;
  sendingDelay = 0;
  messageTtl = 3600;
  trackingMode = "trackingOff";
  retryClientErrors = false;
  messageBackoff = 1000;
  backoffMultiplier = 1;
  backoffMaxIntervalInSec = 600;
}

export interface GroupFormValues extends FormValues<never> {
  name: string;
}
