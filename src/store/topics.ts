import { action, observable } from "mobx";
import { fetchJson } from "../api";
import { Hosts } from "../config";
import { debouncedTask } from "../helpers/debouncedTask";
import { Store } from "./store";
import { Topic } from "./topic";

export class Topics {
  fetchTask = debouncedTask(this.fetchTopics);
  @observable names: string[] = [];
  @observable topicsMap = observable.map<string, Topic>();
  forGroup = (groupName: string) =>
    this.names
      ? this.names.filter((name) => name.indexOf(`${groupName}.`) === 0)
      : [];

  constructor(private readonly store: Store) {}

  getTopicDisplayName(topicName: string): string {
    return this.topicsMap.get(topicName)?.displayName;
  }

  @action.bound
  private fetchTopics() {
    const url = `${Hosts.APP_API}/topics`;
    return fetchJson<string[]>(url, true).then(
      action((data) => {
        this.names = data;
        data.forEach(
          (topicName) =>
            this.topicsMap.get(topicName) ||
            this.topicsMap.set(topicName, new Topic(topicName, this.store))
        );
        [...this.topicsMap.keys()].forEach(
          (topic) => data.includes(topic) || this.topicsMap.delete(topic)
        );
      })
    );
  }
}

export class ValidationError {
  message: string;
  code: string;
}
