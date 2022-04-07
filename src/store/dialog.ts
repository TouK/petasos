import { action, computed, observable } from "mobx";
import { debouncedTask } from "../helpers/debouncedTask";

export class Dialog<T = void, R = void> {
  open = debouncedTask.rejected(this.openFn, { wait: 0 });
  private resolver: (value: R) => void;
  @observable private _isOpen: boolean;
  @observable private _params: T | null;

  @computed get params(): Partial<T> {
    return this._params || {};
  }

  @computed get isOpen(): boolean {
    return this.open.pending;
  }

  @action.bound close(result?: R) {
    this._isOpen = false;
    this._params = null;
    if (this.resolver) {
      this.resolver(result || null);
      this.resolver = null;
    }
  }

  @action.bound
  private openFn(params: T): Promise<R | null> {
    this._isOpen = true;
    this._params = params;
    return new Promise<R | null>((resolve) => {
      this.resolver = resolve;
    });
  }
}
