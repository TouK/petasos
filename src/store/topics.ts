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
    return this.getByName(topicName)?.displayName;
  }

  getByName(name: string): Topic {
    return this.topicsMap.get(name);
  }

  @action.bound
  private fetchTopics() {
    const url = `${Hosts.APP_API}/topics`;
    return fetchJson<string[]>(url, true).then(
      action((data) => {
        this.names = data;
        data.forEach(
          (topicName) =>
            this.getByName(topicName) ||
            this.topicsMap.set(topicName, new Topic(topicName, this.store))
        );
        [...this.topicsMap.keys()].forEach(
          (topicName) =>
            data.includes(topicName) || this.topicsMap.delete(topicName)
        );
      })
    );
  }
}

export class ValidationError {
  message: string;
  code: string;
}
