import { computed, observable } from "mobx";
import { Store } from "./store";

export class Group {
    @observable name: string;

    constructor(private readonly store: Store, name: string) {
        this.name = name;
    }

    @computed get topics(): string[] {
        return this.store.topics.forGroup(this.name);
    }
}
