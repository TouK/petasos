import {action, observable} from "mobx";

export class Dialog {
    @observable open = false;
    @action setOpen(v: boolean): void { this.open = v }
}

export class DeleteGroupDialog {
    @observable groupToBeDeleted: string = undefined
    @action setGroupToBeDeleted(v: string) { this.groupToBeDeleted = v }
}