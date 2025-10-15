import { action, computed, observable, runInAction } from "mobx";
import moment from "moment";
import { Hosts } from "../config";
import { Dialog } from "./dialog";
import { Groups } from "./groups";
import { Subscription } from "./subscription";
import { Topic } from "./topic";
import { Topics } from "./topics";

export type Dialogs = Store["dialogs"];
export type OpenArgs<K extends keyof Dialogs> = Dialogs[K] extends Dialog<infer P> ? [P] : never;

export interface StoreOptions {
    forcedGroupName?: string;
    groupsHidden?: boolean;
    allowAdvancedFields?: boolean;
    open?: <K extends keyof Dialogs>(open: () => void, key: K, ...args: OpenArgs<K>) => void;
}

interface HermesConsoleSettings {
    topic: {
        avroContentTypeMetadataRequired: boolean;
        [key: string]: unknown;
    };

    [key: string]: unknown;
}

export class Store {
    @observable readonly groups = new Groups(this);
    @observable readonly topics = new Topics(this);
    @observable readonly dialogs = {
        //groups
        group: new Dialog<void, string>(),
        deleteGroupDialog: new Dialog<{ group: string }>(),

        //topics
        topic: new Dialog<{ topic: Topic; group?: string }>(),
        editTopic: new Dialog<{ topic: Topic }>(),
        addClonedTopic: new Dialog<{ topic: Topic }>(),
        deleteTopicDialog: new Dialog<{ topic: Topic }>(),

        //subscription
        subscription: new Dialog<{ topic: Topic }>(),
        editSubscription: new Dialog<{
            topic: Topic;
            subscription: Subscription;
        }>(),
        addClonedSubscription: new Dialog<{
            topic: Topic;
            subscription: Subscription;
        }>(),
        deleteSubscriptionDialog: new Dialog<{
            topic: Topic;
            subscription: Subscription;
        }>(),
        retransmitMessageDialog: new Dialog<{
            subscription: Subscription;
            selectedDate: moment.Moment;
        }>(),
        changeSubscriptionStateDialog: new Dialog<{
            subscription: Subscription;
        }>(),
    };

    @action.bound
    dialogOpen<K extends keyof Dialogs>(key: K, ...args: OpenArgs<K>): void {
        const dialog = this.dialogs[key];
        this.options.open?.(() => dialog.open(...(args as any)), key, ...args);
    }

    @observable options: StoreOptions = {};

    constructor(options: StoreOptions = {}) {
        this.setOptions(options);
    }

    @action setOptions(options: StoreOptions) {
        this.options = options;
    }

    @computed
    get hermesConsoleSettings(): HermesConsoleSettings {
        if (!this._hermesConsoleSettings) {
            this.fetchHermesConsoleSettings();
        }
        return this._hermesConsoleSettings;
    }

    @observable private _hermesConsoleSettings: HermesConsoleSettings;

    private async fetchHermesConsoleSettings(): Promise<void> {
        const res = await fetch(`${Hosts.APP_API}/console`);
        const value = await res.text();
        const json = value.replace(/^.+=/, "");
        const hermesConsoleSettings = JSON.parse(json);
        runInAction(() => {
            this._hermesConsoleSettings = hermesConsoleSettings;
        });
    }
}
