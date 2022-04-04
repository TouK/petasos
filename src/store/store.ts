import { createBrowserHistory } from "history";
import { action, observable } from "mobx";
import { DeleteGroupDialog, Dialog } from "./dialog";
import { Groups } from "./groups";
import { Topics } from "./topics";

export const history = createBrowserHistory({
  basename: window.document.baseURI.replace(window.location.origin, ""),
});

export interface StoreOptions {
  forcedGroupName?: string;
  groupsHidden?: boolean;
}

export class Store {
  @observable readonly groups = new Groups(this);
  @observable readonly topics = new Topics(this);
  @observable readonly dialogs = {
    topic: new Dialog(),
    editTopic: new Dialog(),
    addClonedTopic: new Dialog(),
    group: new Dialog(),
    subscription: new Dialog(),
    editSubscription: new Dialog(),
    addClonedSubscription: new Dialog(),
    deleteGroupDialog: new DeleteGroupDialog(),
    deleteTopicDialog: new Dialog(),
    deleteSubscriptionDialog: new Dialog(),
  };

  @observable options: StoreOptions = {};

  constructor(options: StoreOptions = {}) {
    this.setOptions(options);
  }

  setOptions = action((options: StoreOptions = {}) => {
    this.options = options;
  });
}
