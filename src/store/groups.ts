import {action, computed, observable} from "mobx";
import {task} from "mobx-task";
import {fetchFn} from "../api";
import {Hosts} from "../config";
import {Store} from "./store";
import {ValidationError} from "./topics";

export class Groups {
    fetchTask = task(this.fetchGroups);
    addTask = task.resolved(this.addGroup);
    deleteTask = task.resolved(this.deleteGroup);
    @observable names: string[] = [];
    @observable selectedGroup: string = null;
    @observable defaultGroup: string = undefined;
    private url = `${Hosts.APP_API}/groups`;

    constructor (private readonly store: Store) {
    }

    @computed get topicsPerGroup (): Map<string, string[]> {
        return this.names.reduce((map: Map<string, string[]>, obj: string) => {
            map.set(obj, this.store.topics.getTopicsOfGroup(obj));
            return map;
        }, new Map<string, string[]>());
    }

    @computed get groupOfSelectedTopic (): string {
        if (this.store.topics.selectedTopicName === null) {
            return null;
        }
        const filteredTopics = this.names.filter(group =>
            this.store.topics.selectedTopicName.indexOf(group) === 0
            && this.store.topics.selectedTopicName.split(".").length == group.split(
                ".").length + 1);
        return filteredTopics.length > 0
            ? filteredTopics[0]
            : null;
    }

    @computed get allTopicsList (): string[] {
        let list = [];
        this.names.forEach(group => list = list.concat(this.topicsPerGroup.get(
            group)));
        return list;
    }

    @action.bound
    changeSelectedGroup (group: string) {
        this.selectedGroup = group;
    }

    @action.bound
    changeDefaultGroup (group: string) {
        this.defaultGroup = group;
    }

    private fetchGroups () {
        return fetchFn<string[]>(this.url, true).
            then(
                action((data) => {
                    if (data) {
                        this.names = data;
                    } else {
                        this.names = [];
                    }
                })
            );
    }

    private async addGroup (name: string): Promise<ValidationError | void> {
        const body = JSON.stringify({"groupName": name});
        return await fetchFn<ValidationError>(
            this.url,
            false,
            {
                method: "POST",
                body
            }
        );
    }

    private async deleteGroup (name: string) {
        const deleteUrl = `${this.url}/${name}`;
        await fetchFn(deleteUrl, true, {method: "DELETE"});
    }


}
