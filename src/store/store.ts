import { action, computed, observable, runInAction } from "mobx";
import moment from "moment";
import { ReactNode } from "react";
import { Hosts } from "../config";
import { Dialog } from "./dialog";
import { DialogBase } from "./dialogBase";
import { Groups } from "./groups";
import { PromptDialog } from "./promptDialog";
import { Subscription } from "./subscription";
import { Topic } from "./topic";
import { Topics } from "./topics";

export type DialogsType = Store["dialogs"];
export type OpenDialogArgs<K extends keyof DialogsType> = DialogsType[K] extends DialogBase<infer P> ? [P] : never;

export interface StoreOptions {
    forcedGroupName?: string;
    groupsHidden?: boolean;
    allowAdvancedFields?: boolean;
    open?: <K extends keyof DialogsType>(open: (callback?: (dialog: DialogsType[K]) => void) => Promise<void>, key: K) => void;
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
        group: new Dialog<void, string>(() => "Add new group"),
        deleteGroupDialog: new PromptDialog<{ group: string }>(),

        //topics
        topic: new Dialog<{ topic: Topic; group?: string }>(() => "Add new topic"),
        editTopic: new Dialog<{ topic: Topic }>(() => "Edit topic"),
        addClonedTopic: new Dialog<{ topic: Topic }>(() => "Add new topic"),
        deleteTopicDialog: new PromptDialog<{ topic: Topic }>(),

        //subscription
        subscription: new Dialog<{ topic: Topic }>(({ topic }) => `Add new subscription to topic ${topic?.name}`),
        editSubscription: new Dialog<{
            topic: Topic;
            subscription: Subscription;
        }>(({ topic }) => `Edit subscription to topic ${topic?.name}`),
        addClonedSubscription: new Dialog<{
            topic: Topic;
            subscription: Subscription;
        }>(({ topic }) => `Add new subscription to topic ${topic?.name}`),
        deleteSubscriptionDialog: new PromptDialog<{
            topic: Topic;
            subscription: Subscription;
        }>(),
        retransmitMessageDialog: new PromptDialog<{
            subscription: Subscription;
            selectedDate: moment.Moment;
        }>(),
        changeSubscriptionStateDialog: new PromptDialog<{
            subscription: Subscription;
        }>(),
    };

    @action.bound
    setDialogView(key: string, view: ReactNode): void {
        const dialog = this.dialogs[key];
        if (dialog instanceof Dialog) {
            dialog.view = view;
        }
    }

    @action.bound
    dialogOpen<K extends keyof DialogsType>(key: K, ...args: OpenDialogArgs<K>): void {
        const dialog = this.dialogs[key];
        if (dialog instanceof Dialog) {
            this.options.open?.(async (callback) => {
                const task = dialog.open(...(args as any));
                setTimeout(() => callback?.(dialog), 100);
                await task;
            }, key);
        } else {
            dialog.open(...(args as any));
        }
    }
    @action.bound
    dialogClose(key: string): void {
        const dialog = this.dialogs[key];
        if (dialog instanceof Dialog) {
            dialog.close();
        }
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
