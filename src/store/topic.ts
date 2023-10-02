import { action, computed, observable, runInAction, toJS } from "mobx";
import urlJoin from "url-join";
import { fetchFn } from "../api";
import { HermesFrontendUrl, Hosts } from "../config";
import { debouncedTask } from "../helpers/debouncedTask";
import {
    Acknowledgement,
    AuthModel,
    MessagePreviewModel,
    OwnerModel,
    RetentionTimeModel,
    SubscriptionModel,
    TopicDataOfflineStorageModel,
    TopicFormikValues,
    TopicModel,
} from "../models";
import { addMetadata, withoutMetadataFields } from "./metadata";
import { Store } from "./store";
import { Subscription } from "./subscription";
import { ValidationError } from "./topics";

export class Topic implements TopicModel {
    static GROUP_NAME_SEPARATOR = ".";

    @computed get reqUrl(): string {
        return urlJoin(HermesFrontendUrl, "topics", this.name);
    }

    createTask = debouncedTask(this.create);
    @observable name: string;
    fetchTask = debouncedTask(this.fetchTopic);
    fetchSubscriptionsTask = debouncedTask(this.fetchTopicSubscriptions);
    fetchMessagePreviewTask = debouncedTask(this.fetchMessagePreview);
    postSubscriptionTask = debouncedTask(this.postSubscription);
    updateTask = debouncedTask(this.update);
    @observable ack: Acknowledgement = "LEADER";
    deleteTask = debouncedTask.rejected(this.removeTopic);
    @observable description: string;
    @observable retentionTime: RetentionTimeModel = new DefaultStorageRetentionTimeModel(1, undefined);
    @observable jsonToAvroDryRun: boolean;
    @observable trackingEnabled: boolean;
    @observable migratedFromJsonType: boolean;
    @observable schemaIdAwareSerializationEnabled: boolean;
    @observable contentType = "AVRO";
    @observable maxMessageSize = 10240;
    @observable auth: AuthModel;
    @observable createdAt: number;
    @observable modifiedAt: number;
    @observable offlineStorage: TopicDataOfflineStorageModel = new DefaultOfflineStorage();
    @observable owner: OwnerModel = new DefaultOwner();
    @observable schemaIdAwareSerializationSchemaEnabled: boolean;
    @observable subscribingRestricted: boolean;
    @observable schema: string;
    @observable subscriptionsMap = observable.map<string, Subscription>();
    @observable messagePreview: MessagePreviewModel[];
    @observable group: string;
    private replacer = (key, value) => {
        if (key === "parent") {
            return undefined;
        }
        return value;
    };
    private jsonPrettify = (schema: string): string => {
        try {
            const jsonSchema = JSON.parse(schema);
            return JSON.stringify(withoutMetadataFields(jsonSchema), null, 2);
        } catch (err) {
            return "{}";
        }
    };

    constructor(name: string, private readonly store: Store) {
        runInAction(() => (this.name = name));
    }

    @computed get displayName(): string {
        const [group, topic] = Topic.splitName(this.name);
        return group === this.store.options.forcedGroupName ? topic : this.name;
    }

    @computed get model(): TopicModel {
        return toJS({
            ack: this.ack,
            auth: this.auth,
            contentType: this.contentType,
            createdAt: this.createdAt,
            description: this.description,
            jsonToAvroDryRun: this.jsonToAvroDryRun,
            maxMessageSize: this.maxMessageSize,
            migratedFromJsonType: this.migratedFromJsonType,
            modifiedAt: this.modifiedAt,
            name: this.name,
            offlineStorage: this.offlineStorage,
            owner: this.owner,
            retentionTime: this.retentionTime,
            schema: this.schema,
            schemaIdAwareSerializationSchemaEnabled: this.schemaIdAwareSerializationSchemaEnabled,
            subscribingRestricted: this.subscribingRestricted,
            trackingEnabled: this.trackingEnabled,
        });
    }

    set model(topicData: TopicModel) {
        this.description = topicData.description;
        this.retentionTime = topicData.retentionTime;
        this.jsonToAvroDryRun = topicData.jsonToAvroDryRun;
        this.ack = topicData.ack;
        this.trackingEnabled = topicData.trackingEnabled;
        this.migratedFromJsonType = topicData.migratedFromJsonType;
        this.schemaIdAwareSerializationEnabled = topicData.schemaIdAwareSerializationSchemaEnabled;
        this.contentType = topicData.contentType;
        this.maxMessageSize = topicData.maxMessageSize;
        this.auth = topicData.auth;
        this.createdAt = topicData.createdAt;
        this.modifiedAt = topicData.modifiedAt;
        this.offlineStorage = topicData.offlineStorage;
        this.owner = topicData.owner;
        this.schemaIdAwareSerializationEnabled = topicData.schemaIdAwareSerializationSchemaEnabled;
        this.subscribingRestricted = topicData.subscribingRestricted;
        this.schema = topicData.schema;
    }

    @computed get schemaPrettified() {
        return this.jsonPrettify(this.schema);
    }

    static splitName(name: string): string[] {
        return name.split(Topic.GROUP_NAME_SEPARATOR);
    }

    static joinName(group: string, name: string) {
        return [group, name].join(Topic.GROUP_NAME_SEPARATOR);
    }

    static create(values: TopicFormikValues, store: Store): Promise<ValidationError | void> {
        const topic = new Topic(Topic.joinName(values.group, values.topic), store);
        return topic.createTask(values);
    }

    @action.bound
    private async create(object: TopicFormikValues): Promise<ValidationError | void> {
        const model = this.getModelFromForm(object);
        const url = `${Hosts.APP_API}/topics`;
        const body = JSON.stringify(model);
        return await fetchFn<ValidationError | void>(url, {
            method: "POST",
            body,
        });
    }

    @computed
    private get metadataRequired() {
        return this.store.hermesConsoleSettings?.topic.avroContentTypeMetadataRequired;
    }

    private getModelFromForm(object: TopicFormikValues): TopicModel {
        const value = this.model;
        if (object.schema) {
            value.schema = this.metadataRequired ? addMetadata(object.schema) : object.schema;
        }
        if (object.description) {
            value.description = object.description;
        }
        if (object.advancedValues) {
            if (object.advancedValues.retentionTime) {
                value.retentionTime = new DefaultStorageRetentionTimeModel(object.advancedValues.retentionTime, false);
                if (object.advancedValues.maxMessageSize) {
                    value.maxMessageSize = object.advancedValues.maxMessageSize;
                }
            }
            if (object.advancedValues.trackingEnabled) {
                value.trackingEnabled = object.advancedValues.trackingEnabled;
            }
            if (object.advancedValues.acknowledgement) {
                value.ack = object.advancedValues.acknowledgement;
            }
        }
        return toJS(value);
    }

    @action.bound
    private async fetchTopic() {
        if (!this.name) {
            console.log("Something went wrong...");
            return;
        }
        const url = `${Hosts.APP_API}/topics/${this.name}`;
        const result = fetchFn<TopicModel>(url).then(
            action((data) => {
                this.model = data;
            }),
        );
        await this.fetchSubscriptionsTask();
        return result;
    }

    @action.bound
    private fetchTopicSubscriptions() {
        if (!this.name) {
            console.log("Something went wrong...");
            return;
        }
        const url = `${Hosts.APP_API}/topics/${this.name}/subscriptions`;
        return fetchFn<string[]>(url).then(
            action((data = []) =>
                this.subscriptionsMap.replace(
                    data.reduce(
                        (values, name) => values.set(name, this.subscriptionsMap.get(name) || new Subscription(name, this)),
                        new Map<string, Subscription>(),
                    ),
                ),
            ),
        );
    }

    @action.bound
    private async postSubscription(data: Partial<SubscriptionModel>): Promise<ValidationError | void> {
        const url = `${Hosts.APP_API}/topics/${this.name}/subscriptions`;
        const body = JSON.stringify(
            {
                ...data,
                topicName: data.topicName,
            },
            this.replacer,
        );
        return await fetchFn<ValidationError | void>(url, {
            method: "POST",
            body,
        });
    }

    @action.bound
    private async update(object: TopicFormikValues): Promise<ValidationError | void> {
        const url = `${Hosts.APP_API}/topics/${this.name}`;
        const model = this.getModelFromForm(object);
        const body = JSON.stringify(model);
        const response = await fetchFn<ValidationError | void>(url, {
            method: "PUT",
            body,
        });
        this.model = model;
        return response;
    }

    @action.bound
    private async removeTopic(): Promise<ValidationError | void> {
        const url = `${Hosts.APP_API}/topics/${this.name}`;
        return await fetchFn<ValidationError | null>(url, {
            method: "DELETE",
        });
    }

    @action.bound
    private async fetchMessagePreview(): Promise<MessagePreviewModel[]> {
        const messagePreviewUrl = `${Hosts.APP_API}/topics/${this.name}/preview`;
        const messagePreview = await fetchFn<MessagePreviewModel[]>(messagePreviewUrl, { method: "GET" });
        runInAction(() => (this.messagePreview = messagePreview));
        return messagePreview;
    }
}

class DefaultOfflineStorage implements TopicDataOfflineStorageModel {
    enabled = false;
    retentionTime: RetentionTimeModel = new DefaultStorageRetentionTimeModel(60, undefined);
}

class DefaultStorageRetentionTimeModel implements RetentionTimeModel {
    duration: number;
    infinite: boolean;

    constructor(duration: number, infinite: boolean) {
        this.duration = duration;
        this.infinite = infinite;
    }
}

export class DefaultOwner implements OwnerModel {
    id = "Default";
    source = "Plaintext";
}
