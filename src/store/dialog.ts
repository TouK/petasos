import { computed, observable } from "mobx";
import { ReactNode } from "react";
import { DialogBase } from "./dialogBase";

export class Dialog<T = void, R = void> extends DialogBase<T, R> {
    view: ReactNode | null = null;

    @observable private _titleGetter: (params: T) => string;

    @computed get title(): string | null {
        return this._titleGetter(this.params);
    }

    constructor(titleGetter: (params: T) => string | null) {
        super();
        this._titleGetter = titleGetter;
    }
}
