import { action, computed, observable } from "mobx";
import { task } from "mobx-task";
import { computedFn } from "mobx-utils";
import { fetchJson } from "../api";
import { Hosts } from "../config";
import { TopicModel } from "../models";
import { Subscription } from "./subscription";
import { Topic } from "./topic";

export class Topics {
  fetchTask = task(this.fetchTopics);
  postTask = task(this.postTopic);

  @observable names: string[] = [];
  @observable selectedTopicName: string = null;
  @observable selectedSubscriptionName: string = null;
  @observable topicsMap: Map<string, Topic> = new Map<string, Topic>();
  getTopicsOfGroup = computedFn(function getTopicsOfGroup(
    groupName: string
  ): string[] {
    return this.names
      ? this.names.filter((name) => name.indexOf(groupName + ".") === 0)
      : [];
  });
  @action.bound
  changeSelectedTopic = (topicName: string) => {
    this.selectedSubscriptionName = null;
    this.selectedTopicName = topicName;
  };
  @action.bound
  changeSelectedSubscription = (subscriptionName: string) => {
    this.selectedSubscriptionName = subscriptionName;
  };

  @computed get selectedTopic(): Topic {
    return this.selectedTopicName === null
      ? null
      : this.topicsMap.get(this.selectedTopicName) || null;
  }

  @computed get selectedSubscription(): Subscription {
    return (
      this.selectedTopicName &&
      this.selectedSubscriptionName &&
      (this.selectedTopic.subscriptionsMap.get(this.selectedSubscriptionName) ||
        null)
    );
  }

  private fetchTopics() {
    const url = `${Hosts.APP_API}/topics`;
    return fetchJson<string[]>(url, true).then(
      action((data) => {
        this.names = data;
        data.forEach(
          (topicName) =>
            this.topicsMap.get(topicName) ||
            this.topicsMap.set(topicName, new Topic(topicName))
        );
        [...this.topicsMap.keys()].forEach(
          (topic) => data.includes(topic) || this.topicsMap.delete(topic)
        );
      })
    );
  }

  @action.bound
  private async postTopic(
    data: Partial<TopicModel>
  ): Promise<ValidationError | void> {
    const url = `${Hosts.APP_API}/topics`;
    const fetchFn = fetchJson;
    const body = JSON.stringify({ ...data });
    return await fetchFn<ValidationError | void>(url, false, {
      method: "POST",
      body,
    });
  }
}

export class ValidationError {
  message: string;
  code: string;
}
