import { createBrowserHistory } from "history";
import { observable } from "mobx";
import { DeleteGroupDialog, Dialog } from "./dialog";
import { Groups } from "./groups";
import { Topics } from "./topics";

export const history = createBrowserHistory({
  basename: window.document.baseURI.replace(window.location.origin, ""),
});

export class Store {
  @observable readonly groups = new Groups(this);
  @observable readonly topics = new Topics();
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
}
