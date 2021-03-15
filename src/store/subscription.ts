import {action, computed, observable, runInAction} from "mobx";
import {
    MonitoringDetailsModel,
    OwnerModel,
    SubscriptionFormikValues, SubscriptionMetrics,
    SubscriptionModel,
    SubscriptionPolicyModel, UndeliveredMessage
} from "../models";
import {DefaultOwner, Topic} from "./topic";
import {fetchFn} from "../api";
import {Hosts} from "../config";
import {task} from "mobx-task";
import {ValidationError} from "./topics";
import moment from "moment";

export class Subscription implements SubscriptionModel {
    @observable name: string;

    constructor(n: string, private readonly parent: Topic) {
        runInAction(() => this.name = n)
        this.url = `${Hosts.APP_API}/topics/${this.parent.name}/subscriptions/${this.name}`
    }

    fetchTask = task(this.fetchSubscription)
    putTask = task(this.putSubscription)
    suspendTask = task.resolved(this.suspendSubscription)
    activateTask = task.resolved(this.activateSubscription)
    fetchMetricsTask = task(this.getMetrics)
    fetchLastUndeliveredMsgTask = task(this.getLastUndeliveredMessage)
    fetch100LastUndeliveredMsgsTask = task(this.get100LastUndeliveredMessages)
    retransmitMessagesTask = task.resolved(this.retransmitMessages)

    @observable endpoint: string;
    @observable description: string;
    @observable owner: OwnerModel = new DefaultOwner()
    @observable contentType = "JSON"
    @observable deliveryType = "SERIAL"
    @observable mode = "ANYCAST"
    @observable createdAt: number;
    @observable http2Enabled: boolean;
    @observable modifiedAt: number;
    @observable monitoringDetails: MonitoringDetailsModel = new DefaultMonitoringDetails();
    @observable state: string;
    @observable subscriptionIdentityHeadersEnabled: boolean;
    @observable subscriptionPolicy: SubscriptionPolicyModel = new DefaultSubscriptionPolicy();
    @observable trackingEnabled: boolean;
    @observable trackingMode: string;
    @observable filters: string[] = [];
    @observable headers: string[] = [];
    @observable lastUndeliveredMessage: UndeliveredMessage
    @observable lastUndeliveredMessages: UndeliveredMessage[]
    @observable metrics: SubscriptionMetrics

    @computed get topicName(): string {
        return this.parent.name;
    }

    @action
    assignValuesFromForm(object: SubscriptionFormikValues, includeAdvanced: boolean) {
        this.name = object.name;
        this.endpoint = object.endpoint;
        this.description = object.description;
        if (includeAdvanced) {
            if (object.advancedValues.trackingMode) this.trackingMode = object.advancedValues.trackingMode;
            if (object.advancedValues.backoffMultiplier) {
                this.subscriptionPolicy.backoffMultiplier = Number(object.advancedValues.backoffMultiplier);
                if (object.advancedValues.backoffMaxIntervalInSec) this.subscriptionPolicy.backoffMaxIntervalInSec =
                    Number(object.advancedValues.backoffMaxIntervalInSec)
            }
            if (object.advancedValues.messageBackoff) this.subscriptionPolicy.messageBackoff = Number(object.advancedValues.messageBackoff);
            if (object.advancedValues.messageTtl) this.subscriptionPolicy.messageTtl = Number(object.advancedValues.messageTtl);
            if (object.advancedValues.mode) this.mode = object.advancedValues.mode;
            if (object.advancedValues.rate) this.subscriptionPolicy.rate = Number(object.advancedValues.rate);
            if (object.advancedValues.retryClientErrors) this.subscriptionPolicy.retryClientErrors = object.advancedValues.retryClientErrors;
            if (object.advancedValues.sendingDelay) this.subscriptionPolicy.sendingDelay = Number(object.advancedValues.sendingDelay);
        }
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
                backoffMaxIntervalInSec: this.subscriptionPolicy.backoffMaxIntervalInSec
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

    private readonly url: string

    private fetchSubscription() {
        if (!this.name) {
            console.error("Something is off");
            return;
        }
        return fetchFn<SubscriptionModel>(this.url, true)
            .then(
                action((data: SubscriptionModel) => {
                    this.update(data)
                })
            )
    }

    @action.bound
    private async putSubscription(): Promise<ValidationError | void> {
        const replacer = (key, value) => {
            if (key === "putSubscription" || key === "parent") {
                return undefined;
            }
            return value;
        }
        const body = JSON.stringify({...this}, replacer)
        return await fetchFn<ValidationError | void>(this.url, false, {method: 'PUT', body})
    }

    private suspendSubscription(): Promise<void> {
        return this.changeState("SUSPENDED");
    }

    private activateSubscription(): Promise<void> {
        return this.changeState("ACTIVE");
    }

    @action.bound
    private async changeState(state: string): Promise<void> {
        const body = JSON.stringify(state)
        return await fetchFn<void>(`${this.url}/state`, false, {method: 'PUT', body})
    }

    @action
    private async getMetrics(): Promise<SubscriptionMetrics> {
        const metricsUrl = `${this.url}/metrics`;
        const metrics = await fetchFn<SubscriptionMetrics>(metricsUrl, false, {method: 'GET'});
        runInAction(() => this.metrics = metrics)
        return metrics;
    }

    @action.bound
    private async getLastUndeliveredMessage(): Promise<UndeliveredMessage> {
        const undeliveredUrl = `${this.url}/undelivered/last`;
        let message = null;
        try {
            message = await fetchFn<UndeliveredMessage>(undeliveredUrl, true, {method: 'GET'});
        } catch (err) {
            // Hermes API returns 404 if there is no undelivered message
            message = null;
            return null;
        }
        runInAction(() => this.lastUndeliveredMessage = message)
        return message;
    }

    @action.bound
    private async get100LastUndeliveredMessages(): Promise<UndeliveredMessage[]> {
        const undeliveredUrl = `${this.url}/undelivered`;
        const lastUndeliveredMessages = await fetchFn<UndeliveredMessage[]>(undeliveredUrl, true, {method: 'GET'});
        runInAction(() => this.lastUndeliveredMessages = lastUndeliveredMessages);
        return lastUndeliveredMessages;
    }

    @action.bound
    private async retransmitMessages(date: moment.Moment): Promise<void> {
        const retransmissionUrl = `${this.url}/retransmission`;
        const body = date.format(moment.HTML5_FMT.DATETIME_LOCAL);
        return await fetchFn<void>(retransmissionUrl, true, {method: 'PUT', body});
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