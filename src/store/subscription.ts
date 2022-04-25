import { action, computed, observable, runInAction } from "mobx";
import moment from "moment";
import { fetchFn } from "../api";
import { Hosts } from "../config";
import { debouncedTask } from "../helpers/debouncedTask";
import {
  MonitoringDetailsModel,
  OwnerModel,
  SubscriptionFormikValues,
  SubscriptionMetrics,
  SubscriptionModel,
  SubscriptionPolicyModel,
  UndeliveredMessage,
} from "../models";
import { DefaultOwner, Topic } from "./topic";
import { ValidationError } from "./topics";

export class Subscription implements SubscriptionModel {
  @observable name: string;
  fetchTask = debouncedTask(this.fetchSubscription);
  putTask = debouncedTask(this.putSubscription);
  suspendTask = debouncedTask.rejected(this.suspendSubscription);
  activateTask = debouncedTask.rejected(this.activateSubscription);
  deleteTask = debouncedTask.rejected(this.deleteSubscription);
  fetchMetricsTask = debouncedTask(this.getMetrics);
  fetchLastUndeliveredMsgTask = debouncedTask(this.getLastUndeliveredMessage);
  fetch100LastUndeliveredMsgsTask = debouncedTask(
    this.get100LastUndeliveredMessages
  );
  retransmitMessagesTask = debouncedTask.rejected(this.retransmitMessages);
  @observable endpoint: string;
  @observable description: string;
  @observable owner: OwnerModel = new DefaultOwner();
  @observable contentType = "JSON";
  @observable deliveryType = "SERIAL";
  @observable mode = "ANYCAST";
  @observable createdAt: number;
  @observable http2Enabled: boolean;
  @observable modifiedAt: number;
  @observable monitoringDetails: MonitoringDetailsModel =
    new DefaultMonitoringDetails();
  @observable state: string;
  @observable subscriptionIdentityHeadersEnabled: boolean;
  @observable subscriptionPolicy: SubscriptionPolicyModel =
    new DefaultSubscriptionPolicy();
  @observable trackingEnabled: boolean;
  @observable trackingMode: string;
  @observable filters: string[] = [];
  @observable headers: string[] = [];
  @observable lastUndeliveredMessage: UndeliveredMessage;
  @observable lastUndeliveredMessages: UndeliveredMessage[];
  @observable metrics: SubscriptionMetrics;
  private readonly url: string;

  constructor(n: string, private readonly parent: Topic) {
    runInAction(() => (this.name = n));
    this.url = `${Hosts.APP_API}/topics/${this.parent.name}/subscriptions/${this.name}`;
  }

  @computed get topicName(): string {
    return this.parent.name;
  }

  @computed get toForm(): SubscriptionFormikValues {
    return {
      name: this.name,
      endpoint: this.endpoint,
      description: this.description,
      advancedValues: {
        mode: this.mode,
        rate: this.subscriptionPolicy.rate,
        sendingDelay: this.subscriptionPolicy.sendingDelay,
        messageTtl: this.subscriptionPolicy.messageTtl,
        trackingMode: this.trackingMode,
        retryClientErrors: this.subscriptionPolicy.retryClientErrors,
        messageBackoff: this.subscriptionPolicy.messageBackoff,
        backoffMultiplier: this.subscriptionPolicy.backoffMultiplier,
        backoffMaxIntervalInSec:
          this.subscriptionPolicy.backoffMaxIntervalInSec,
      },
    };
  }

  @action
  assignValuesFromForm(object: SubscriptionFormikValues) {
    this.name = object.name;
    this.endpoint = object.endpoint;
    this.description = object.description;
    if (object.advancedValues) {
      if (object.advancedValues.trackingMode) {
        this.trackingMode = object.advancedValues.trackingMode;
      }
      if (object.advancedValues.backoffMultiplier) {
        this.subscriptionPolicy.backoffMultiplier = Number(
          object.advancedValues.backoffMultiplier
        );
        if (object.advancedValues.backoffMaxIntervalInSec) {
          this.subscriptionPolicy.backoffMaxIntervalInSec = Number(
            object.advancedValues.backoffMaxIntervalInSec
          );
        }
      }
      if (object.advancedValues.messageBackoff) {
        this.subscriptionPolicy.messageBackoff = Number(
          object.advancedValues.messageBackoff
        );
      }
      if (object.advancedValues.messageTtl) {
        this.subscriptionPolicy.messageTtl = Number(
          object.advancedValues.messageTtl
        );
      }
      if (object.advancedValues.mode) {
        this.mode = object.advancedValues.mode;
      }
      if (object.advancedValues.rate) {
        this.subscriptionPolicy.rate = Number(object.advancedValues.rate);
      }
      if (object.advancedValues.retryClientErrors) {
        this.subscriptionPolicy.retryClientErrors =
          object.advancedValues.retryClientErrors;
      }
      if (object.advancedValues.sendingDelay) {
        this.subscriptionPolicy.sendingDelay = Number(
          object.advancedValues.sendingDelay
        );
      }
    }
  }

  @action
  private update(subscriptionData: SubscriptionModel) {
    this.description = subscriptionData.description;
    this.endpoint = subscriptionData.endpoint;
    this.contentType = subscriptionData.contentType;
    this.createdAt = subscriptionData.createdAt;
    this.deliveryType = subscriptionData.deliveryType;
    this.http2Enabled = subscriptionData.http2Enabled;
    this.subscriptionPolicy = subscriptionData.subscriptionPolicy;
    this.mode = subscriptionData.mode;
    this.modifiedAt = subscriptionData.modifiedAt;
    this.monitoringDetails = subscriptionData.monitoringDetails;
    this.owner = subscriptionData.owner;
    this.trackingEnabled = subscriptionData.trackingEnabled;
    this.trackingMode = subscriptionData.trackingMode;
    this.state = subscriptionData.state;
    this.filters = subscriptionData.filters;
    this.headers = subscriptionData.headers;
  }

  @action.bound
  private fetchSubscription() {
    if (!this.name) {
      console.error("Something is off");
      return;
    }
    return fetchFn<SubscriptionModel>(this.url, true).then(
      action((data: SubscriptionModel) => {
        this.update(data);
      })
    );
  }

  @action.bound
  private async putSubscription(): Promise<ValidationError | void> {
    const replacer = (key, value) => {
      if (key === "putSubscription" || key === "parent") {
        return undefined;
      }
      return value;
    };
    const body = JSON.stringify({ ...this }, replacer);
    return await fetchFn<ValidationError | void>(this.url, false, {
      method: "PUT",
      body,
    });
  }

  @action.bound
  private suspendSubscription(): Promise<void> {
    return this.changeState("SUSPENDED");
  }

  @action.bound
  private activateSubscription(): Promise<void> {
    return this.changeState("ACTIVE");
  }

  @action.bound
  private async changeState(state: string): Promise<void> {
    const body = JSON.stringify(state);
    return await fetchFn<void>(`${this.url}/state`, false, {
      method: "PUT",
      body,
    });
  }

  @action
  private async getMetrics(): Promise<SubscriptionMetrics> {
    const metricsUrl = `${this.url}/metrics`;
    const metrics = await fetchFn<SubscriptionMetrics>(metricsUrl, false, {
      method: "GET",
    });
    runInAction(() => (this.metrics = metrics));
    return metrics;
  }

  @action.bound
  private async getLastUndeliveredMessage(): Promise<UndeliveredMessage> {
    const undeliveredUrl = `${this.url}/undelivered/last`;
    let message = null;
    try {
      message = await fetchFn<UndeliveredMessage>(undeliveredUrl, true, {
        method: "GET",
      });
    } catch (err) {
      // Hermes API returns 404 if there is no undelivered message
      message = null;
      return null;
    }
    runInAction(() => (this.lastUndeliveredMessage = message));
    return message;
  }

  @action.bound
  private async get100LastUndeliveredMessages(): Promise<UndeliveredMessage[]> {
    const undeliveredUrl = `${this.url}/undelivered`;
    const lastUndeliveredMessages = await fetchFn<UndeliveredMessage[]>(
      undeliveredUrl,
      true,
      { method: "GET" }
    );
    runInAction(() => (this.lastUndeliveredMessages = lastUndeliveredMessages));
    return lastUndeliveredMessages;
  }

  @action.bound
  private deleteSubscription(): Promise<void> {
    const deleteUrl = `${Hosts.APP_API}/topics/${this.parent.name}/subscriptions/${this.name}`;
    return fetchFn(deleteUrl, true, { method: "DELETE" });
  }

  @action.bound
  private async retransmitMessages(date: moment.Moment): Promise<void> {
    const retransmissionUrl = `${this.url}/retransmission`;
    const body = {
      retransmissionDate: date.toISOString(true),
    };
    return await fetchFn<void>(retransmissionUrl, true, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
}

class DefaultSubscriptionPolicy implements SubscriptionPolicyModel {
  backoffMaxIntervalInSec = 600;
  backoffMaxIntervalMillis: number = undefined;
  backoffMultiplier = 1;
  inflightSize: number = undefined;
  messageBackoff = 1000;
  messageTtl = 3600;
  rate = 100;
  requestTimeout: number = undefined;
  retryClientErrors: boolean = undefined;
  sendingDelay = 0;
  socketTimeout: number = undefined;
}

class DefaultMonitoringDetails implements MonitoringDetailsModel {
  reaction = "";
  severity = "NON_IMPORTANT";
}
