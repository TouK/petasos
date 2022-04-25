import { action, observable } from "mobx";
import moment from "moment";
import { Dialog } from "./dialog";
import { Groups } from "./groups";
import { Subscription } from "./subscription";
import { Topic } from "./topic";
import { Topics } from "./topics";

export interface StoreOptions {
  forcedGroupName?: string;
  groupsHidden?: boolean;
  allowAdvancedFields?: boolean;
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

  @observable options: StoreOptions = {};

  constructor(options: StoreOptions = {}) {
    this.setOptions(options);
  }

  setOptions = action((options: StoreOptions = {}) => {
    this.options = options;
  });
}
