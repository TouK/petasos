import { action, autorun, computed, observable } from "mobx";
import { task } from "mobx-task";
import { fetchFn } from "../api";
import { Hosts } from "../config";
import { Group } from "./group";
import { Store } from "./store";
import { ValidationError } from "./topics";

export class Groups {
  fetchTask = task(this.fetchGroups);
  addTask = task.resolved(this.addGroup);
  deleteTask = task.resolved(this.deleteGroup);
  @observable selectedGroup: string = null;
  @observable defaultGroup: string = undefined;
  private url = `${Hosts.APP_API}/groups`;
  @observable private groups = observable.map<string, Group>();

  constructor(private readonly store: Store, private fallbackName?: string) {
    autorun(() => {
      if (
        this.fallbackName &&
        this.fetchTask.resolved &&
        this.groups.size < 1
      ) {
        this.addTask(this.fallbackName).then(() => this.fetchTask());
      }
    });
  }

  @computed get names(): string[] {
    return this.list.map((g) => g.name);
  }

  @computed
  private get list(): Group[] {
    return Array.from(this.groups.values());
  }

  @computed get topicsPerGroup(): Map<string, string[]> {
    const map = new Map<string, string[]>();
    this.groups.forEach((g) => map.set(g.name, g.topics));
    return map;
  }

  @computed get groupOfSelectedTopic(): string {
    const topicName = this.store.topics.selectedTopicName;
    if (!topicName) {
      return null;
    }
    return this.list.find((g) => g.topics.includes(topicName))?.name;
  }

  @computed get allTopicsList(): string[] {
    let list = [];
    this.names.forEach(
      (group) => (list = list.concat(this.topicsPerGroup.get(group)))
    );
    return list;
  }

  @computed get topicsOfSelectedGroup(): string[] {
    return this.topicsPerGroup.get(this.selectedGroup);
  }

  @action.bound
  changeSelectedGroup(group: string) {
    this.selectedGroup = group;
  }

  @action.bound
  changeDefaultGroup(group: string) {
    this.defaultGroup = group;
  }

  private fetchGroups() {
    return fetchFn<string[]>(this.url, true).then(
      action((data = []) =>
        this.groups.replace(
          data.reduce(
            (values, name) =>
              values.set(
                name,
                this.groups.get(name) || new Group(this.store, name)
              ),
            new Map<string, Group>()
          )
        )
      )
    );
  }

  private async addGroup(name: string): Promise<ValidationError | void> {
    const body = JSON.stringify({ groupName: name });
    return await fetchFn<ValidationError>(this.url, false, {
      method: "POST",
      body,
    });
  }

  private async deleteGroup(name: string) {
    const deleteUrl = `${this.url}/${name}`;
    await fetchFn(deleteUrl, true, { method: "DELETE" });
  }
}
