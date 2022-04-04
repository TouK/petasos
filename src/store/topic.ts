import { action, computed, observable, runInAction, toJS } from "mobx";
import { task } from "mobx-task";
import { fetchFn, fetchJson } from "../api";
import { Hosts } from "../config";
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
import { Store } from "./store";
import { Subscription } from "./subscription";
import { ValidationError } from "./topics";

export class Topic implements TopicModel {
  createTask = task(this.create);

  @observable name: string;
  fetchTask = task(this.fetchTopic);
  fetchSubscriptionsTask = task(this.fetchTopicSubscriptions);
  fetchMessagePreviewTask = task(this.fetchMessagePreview);
  postSubscriptionTask = task(this.postSubscription);
  deleteSubscriptionTask = task.resolved(this.deleteSubscription);
  updateTask = task(this.update);
  @observable ack: Acknowledgement = "LEADER";
  deleteTask = task.resolved(this.removeTopic);
  @observable description: string;
  @observable retentionTime: RetentionTimeModel =
    new DefaultStorageRetentionTimeModel(1, undefined);
  @observable jsonToAvroDryRun: boolean;
  @observable trackingEnabled: boolean;
  @observable migratedFromJsonType: boolean;
  @observable schemaIdAwareSerializationEnabled: boolean;
  @observable contentType = "AVRO";
  @observable maxMessageSize = 10240;
  @observable auth: AuthModel;
  @observable createdAt: number;
  @observable modifiedAt: number;
  @observable offlineStorage: TopicDataOfflineStorageModel =
    new DefaultOfflineStorage();
  @observable owner: OwnerModel = new DefaultOwner();
  @observable schemaIdAwareSerializationSchemaEnabled: boolean;
  @observable subscribingRestricted: boolean;
  @observable schema: string;
  @observable subscriptionsMap = observable.map<string, Subscription>();
  @observable messagePreview: MessagePreviewModel[];
  private replacer = (key, value) => {
    if (key === "parent") {
      return undefined;
    }
    return value;
  };
  private prettifiedSchemaWithoutMetadata = (data: TopicModel): string => {
    try {
      const jsonSchema = JSON.parse(data.schema);
      const schemaWithoutMetadata = {
        ...jsonSchema,
        fields: [
          ...jsonSchema.fields.filter((field) => field.name !== "__metadata"),
        ],
      };
      return JSON.stringify(schemaWithoutMetadata, null, 2);
    } catch (err) {
      return "";
    }
  };
  private addMetadataToSchema = (schema: string): string => {
    const metadataField = {
      name: "__metadata",
      type: [
        "null",
        {
          type: "map",
          values: "string",
        },
      ],
      default: null,
      doc: "Field used in Hermes internals to propagate metadata like hermes-id",
    };
    try {
      const jsonSchema = JSON.parse(schema);
      const schemaWithMetadata = {
        ...jsonSchema,
        fields: [...jsonSchema.fields, metadataField],
      };
      return JSON.stringify(schemaWithMetadata);
    } catch {
      return schema;
    }
  };

  constructor(name: string, private readonly store: Store) {
    runInAction(() => (this.name = name));
  }

  @computed get displayName(): string {
    const [group, topic] = this.name.split(".");
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
      schemaIdAwareSerializationSchemaEnabled:
        this.schemaIdAwareSerializationSchemaEnabled,
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
    this.schemaIdAwareSerializationEnabled =
      topicData.schemaIdAwareSerializationSchemaEnabled;
    this.contentType = topicData.contentType;
    this.maxMessageSize = topicData.maxMessageSize;
    this.auth = topicData.auth;
    this.createdAt = topicData.createdAt;
    this.modifiedAt = topicData.modifiedAt;
    this.offlineStorage = topicData.offlineStorage;
    this.owner = topicData.owner;
    this.schemaIdAwareSerializationEnabled =
      topicData.schemaIdAwareSerializationSchemaEnabled;
    this.subscribingRestricted = topicData.subscribingRestricted;
    this.schema = topicData.schema;
  }

  @computed get schemaWithoutMetadata() {
    return this.prettifiedSchemaWithoutMetadata(this);
  }

  @computed get filteredMessagePreview(): string[] {
    return (
      this.messagePreview &&
      this.messagePreview.map((msg) => {
        const jsonSchema = JSON.parse(msg.content);
        const schemaWithoutMetadata = {
          ...jsonSchema,
          __metadata: undefined,
        };
        return JSON.stringify(schemaWithoutMetadata);
      })
    );
  }

  static create(
    values: TopicFormikValues,
    store: Store
  ): Promise<ValidationError | void> {
    const topic = new Topic(values.group + "." + values.topic, store);
    return topic.createTask(values);
  }

  @action.bound
  private async create(
    object: TopicFormikValues
  ): Promise<ValidationError | void> {
    this.assignValuesFromForm(object);
    const url = `${Hosts.APP_API}/topics`;
    const fetchFn = fetchJson;
    const body = JSON.stringify(this.model);
    return await fetchFn<ValidationError | void>(url, false, {
      method: "POST",
      body,
    });
  }

  @action
  private assignValuesFromForm(object: TopicFormikValues) {
    if (object.schema) {
      this.schema = this.addMetadataToSchema(object.schema);
    }
    if (object.description) {
      this.description = object.description;
    }
    if (object.advancedValues) {
      if (object.advancedValues.retentionTime) {
        this.retentionTime = new DefaultStorageRetentionTimeModel(
          object.advancedValues.retentionTime,
          false
        );
        if (object.advancedValues.maxMessageSize) {
          this.maxMessageSize = object.advancedValues.maxMessageSize;
        }
      }
      if (object.advancedValues.trackingEnabled) {
        this.trackingEnabled = object.advancedValues.trackingEnabled;
      }
      if (object.advancedValues.acknowledgement) {
        this.ack = object.advancedValues.acknowledgement;
      }
    }
  }

  private async fetchTopic() {
    if (!this.name) {
      console.log("Something went wrong...");
      return;
    }
    const url = `${Hosts.APP_API}/topics/${this.name}`;
    const result = fetchFn<TopicModel>(url, true).then(
      action((data) => {
        this.model = data;
      })
    );
    await this.fetchTopicSubscriptions();
    return result;
  }

  private fetchTopicSubscriptions() {
    if (!this.name) {
      console.log("Something went wrong...");
      return;
    }
    const url = `${Hosts.APP_API}/topics/${this.name}/subscriptions`;
    return fetchFn<string[]>(url, true).then(
      action((data = []) =>
        this.subscriptionsMap.replace(
          data.reduce(
            (values, name) =>
              values.set(
                name,
                this.subscriptionsMap.get(name) || new Subscription(name, this)
              ),
            new Map<string, Subscription>()
          )
        )
      )
    );
  }

  @action.bound
  private async postSubscription(
    data: Partial<SubscriptionModel>
  ): Promise<ValidationError | void> {
    const url = `${Hosts.APP_API}/topics/${this.name}/subscriptions`;
    const body = JSON.stringify(
      {
        ...data,
        topicName: data.topicName,
      },
      this.replacer
    );
    return await fetchFn<ValidationError | void>(url, false, {
      method: "POST",
      body,
    });
  }

  @action.bound
  private async update(
    object: TopicFormikValues
  ): Promise<ValidationError | void> {
    this.assignValuesFromForm(object);
    const url = `${Hosts.APP_API}/topics/${this.name}`;
    const body = JSON.stringify(this.model);
    return await fetchFn<ValidationError | void>(url, false, {
      method: "PUT",
      body,
    });
  }

  @action.bound
  private async removeTopic(): Promise<ValidationError | void> {
    const url = `${Hosts.APP_API}/topics/${this.name}`;
    return await fetchFn<ValidationError | null>(url, false, {
      method: "DELETE",
    });
  }

  @action.bound
  private async deleteSubscription(name: string) {
    const deleteUrl = `${Hosts.APP_API}/topics/${this.name}/subscriptions/${name}`;
    await fetchFn(deleteUrl, true, { method: "DELETE" });
  }

  @action.bound
  private async fetchMessagePreview(): Promise<MessagePreviewModel[]> {
    const messagePreviewUrl = `${Hosts.APP_API}/topics/${this.name}/preview`;
    const messagePreview = await fetchFn<MessagePreviewModel[]>(
      messagePreviewUrl,
      false,
      { method: "GET" }
    );
    runInAction(() => (this.messagePreview = messagePreview));
    return messagePreview;
  }
}

class DefaultOfflineStorage implements TopicDataOfflineStorageModel {
  enabled = false;
  retentionTime: RetentionTimeModel = new DefaultStorageRetentionTimeModel(
    60,
    undefined
  );
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
