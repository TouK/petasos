import { action, computed, observable, runInAction } from "mobx";
import { task } from "mobx-task";
import { fetchFn } from "../api";
import { Hosts } from "../config";
import {
  AuthModel,
  MessagePreviewModel,
  OwnerModel,
  RetentionTimeModel,
  SubscriptionModel,
  TopicDataOfflineStorageModel,
  TopicFormikValues,
  TopicModel,
} from "../models";
import { Subscription } from "./subscription";
import { ValidationError } from "./topics";

export class Topic implements TopicModel {
  @observable name: string;
  fetchTask = task(this.fetchTopic);
  fetchSubscriptionsTask = task(this.fetchTopicSubscriptions);
  fetchMessagePreviewTask = task(this.fetchMessagePreview);
  postSubscriptionTask = task(this.postSubscription);
  deleteSubscriptionTask = task.resolved(this.deleteSubscription);
  putTask = task(this.putTopic);
  deleteTask = task.resolved(this.removeTopic);
  @observable description: string;
  @observable retentionTime: RetentionTimeModel =
    new DefaultStorageRetentionTimeModel(1, undefined);
  @observable jsonToAvroDryRun: boolean;
  @observable ack = "LEADER";
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
  @observable subscriptionsMap: Map<string, Subscription> = new Map<
    string,
    Subscription
  >();
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

  constructor(n: string) {
    runInAction(() => (this.name = n));
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

  @action
  assignValuesFromForm(object: TopicFormikValues, includeAdvanced: boolean) {
    if (object.schema) {
      this.schema = this.addMetadataToSchema(object.schema);
    }
    if (object.description) {
      this.description = object.description;
    }
    if (includeAdvanced) {
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

  @action
  private update(topicData: TopicModel) {
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

  private async fetchTopic() {
    if (!this.name) {
      console.log("Something went wrong...");
      return;
    }
    const url = `${Hosts.APP_API}/topics/${this.name}`;
    const result = fetchFn<TopicModel>(url, true).then(
      action((data) => {
        this.update(data);
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
      action((data: string[]) => {
        data.forEach(
          (subscriptionName) =>
            this.subscriptionsMap.get(subscriptionName) ||
            this.subscriptionsMap.set(
              subscriptionName,
              new Subscription(subscriptionName, this)
            )
        );
        [...this.subscriptionsMap.keys()].forEach(
          (sub) => data.includes(sub) || this.subscriptionsMap.delete(sub)
        );
      })
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
  private async putTopic(): Promise<ValidationError | void> {
    const url = `${Hosts.APP_API}/topics/${this.name}`;
    const body = JSON.stringify({ ...this }, this.replacer);
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
