import { action, computed, observable } from "mobx";
import { debouncedTask } from "../helpers/debouncedTask";

export class Dialog<T = void, R = void> {
    open = debouncedTask.rejected(this.openFn, { wait: 0 });
    private _resolver: (value: R) => void;
    @observable private _params: T | null;

    @computed get params(): Partial<T> {
        return this._params || {};
    }

    @computed get isOpen(): boolean {
        return this.open.pending;
    }

    @action.bound close(result?: R) {
        this._resolver?.(result || null);
        setTimeout(this.cleanup, 10);
    }

    @action.bound
    private cleanup() {
        this._resolver = null;
        this._params = null;
    }

    @action.bound
    private openFn(params: T): Promise<R | null> {
        return new Promise<R | null>((resolve) => {
            this._params = params;
            this._resolver = resolve;
        });
    }
}
