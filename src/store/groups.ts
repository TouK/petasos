import { action, autorun, computed, observable, ObservableMap } from "mobx";
import { fetchFn } from "../api";
import { Hosts } from "../config";
import { debouncedTask } from "../helpers/debouncedTask";
import { Group } from "./group";
import { Store } from "./store";
import { ValidationError } from "./topics";

export class Groups {
  fetchTask = debouncedTask(this.fetchGroups);
  addTask = debouncedTask.resolved(this.addGroup);
  deleteTask = debouncedTask.rejected(this.deleteGroup);
  private url = `${Hosts.APP_API}/groups`;

  @observable private _groupsMap: ObservableMap<string, Group>;
  @computed private get groupsMap(): ObservableMap<string, Group> {
    if (!this._groupsMap) {
      this._groupsMap = observable.map<string, Group>();
      setTimeout(() => this.fetchTask()); // defer to avoid breaking the rules
    }
    return this._groupsMap;
  }

  constructor(private readonly store: Store) {
    autorun(() => {
      if (this.needsForcedGroup) {
        this.addTask(this.store.options.forcedGroupName).then(this.fetchTask);
      }
    });
  }

  @computed get defaultGroup(): string {
    return this.names.length === 1
      ? this.names[0]
      : this.store.options.forcedGroupName || "";
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

  @computed private get topicsPerGroup(): Map<string, string[]> {
    const map = new Map<string, string[]>();
    this.list.forEach((g) => map.set(g.name, g.topics));
    return map;
  }

  //TODO: store in Topic
  getGroupOfTopic(topicName: string): string {
    const group = this.list.find((g) => g.topics.includes(topicName));
    if (!group) {
      this.fetchTask();
    }
    return group?.name || "";
  }

  getTopicsForGroup(name: string): string[] {
    return this.topicsPerGroup.get(name) || [];
  }

  @computed get allTopicsList(): string[] {
    let list = [];
    this.names.forEach(
      (group) => (list = list.concat(this.getTopicsForGroup(group)))
    );
    return list;
  }

  @computed
  get isGroupAddAllowed() {
    const { groupsHidden } = this.store.options;
    return !groupsHidden || this.groupsMap.size < 1 || this.needsForcedGroup;
  }

  @computed
  get isGroupRemoveAllowed() {
    return this.isGroupAddAllowed || this.groupsMap.size > 1;
  }

  @computed
  get areGroupsHidden() {
    return !this.isGroupRemoveAllowed;
  }

  @computed
  get isGroupsListHidden() {
    return this.areGroupsHidden;
  }

  @computed
  private get list(): Group[] {
    return Array.from(this.groupsMap.values());
  }

  @action.bound
  private fetchGroups() {
    return fetchFn<string[]>(this.url, true).then(
      action((data = []) =>
        this.groupsMap.replace(
          data.reduce(
            (values, name) =>
              values.set(
                name,
                this.groupsMap.get(name) || new Group(this.store, name)
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

  @action.bound
  private async deleteGroup(name: string): Promise<void | ValidationError> {
    const deleteUrl = `${this.url}/${name}`;
    return await fetchFn(deleteUrl, true, { method: "DELETE" });
  }
}
