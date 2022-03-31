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
  @observable _defaultGroup: string;
  private url = `${Hosts.APP_API}/groups`;
  @observable private groups = observable.map<string, Group>();

  constructor(private readonly store: Store) {
    autorun(() => {
      if (this.needsForcedGroup) {
        this.addTask(this.store.options.forcedGroupName).then(this.fetchTask);
      }
    });

    autorun(() => {
      if (this.areGroupsHidden && this.selectedGroup) {
        this.changeSelectedGroup(null);
      }
    });
  }

  @computed get defaultGroup(): string {
    return this.names.length === 1 ? this.names[0] : this._defaultGroup || "";
  }

  @computed get needsForcedGroup() {
    const { forcedGroupName } = this.store.options;
    return (
      this.fetchTask.resolved &&
      forcedGroupName &&
      !this.names.includes(forcedGroupName)
    );
  }

  @computed get names(): string[] {
    return this.list.map((g) => g.name);
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

  @computed
  get isGroupAddAllowed() {
    const { groupsHidden } = this.store.options;
    return !groupsHidden || this.groups.size < 1 || this.needsForcedGroup;
  }

  @computed
  get isGroupRemoveAllowed() {
    return this.isGroupAddAllowed || this.groups.size > 1;
  }

  @computed
  get areGroupsHidden() {
    return !this.isGroupRemoveAllowed;
  }

  @computed
  private get list(): Group[] {
    return Array.from(this.groups.values());
  }

  @action.bound
  changeSelectedGroup(group: string) {
    this.selectedGroup = group;
  }

  @action.bound
  changeDefaultGroup(group: string) {
    this._defaultGroup = group;
  }

  @action.bound
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

    if (!this.isGroupAddAllowed) {
      return {
        message: "no more groups allowed",
        code: "418",
      };
    }

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
