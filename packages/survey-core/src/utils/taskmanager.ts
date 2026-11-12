export interface IExecutable {
  id?: string;
  execute: () => void;
  isCompleted: boolean;
  dispose?: () => void;
}

export class Task implements IExecutable {
  private _isCompleted = false;
  constructor(private func: () => void, private isMultiple = false) {}
  execute = () => {
    if (!this._isCompleted) {
      this.func();
      this._isCompleted = !this.isMultiple;
    }
  };
  public discard() {
    this._isCompleted = true;
  }
  get isCompleted() {
    return this._isCompleted;
  }
}

export function debounce<T extends (...args: any[]) => void>(func: T): { run: T, cancel: () => void, getLastArguments: () => any[], flushSync: () => void, async: boolean } {
  let isSheduled = false;
  let isCanceled = false;
  let funcArgs: any;
  const cancelCallback = () => {
    isCanceled = true;
    funcArgs = undefined;
  };
  const executeFunc = () => {
    if (!isCanceled) {
      func.apply(this, funcArgs);
    }
    funcArgs = undefined;
    isCanceled = false;
    isSheduled = false;
  };
  const result = { run: ((...args: any) => {
    isCanceled = false;
    funcArgs = args;
    if (!isSheduled) {
      isSheduled = true;
      if (result.async) {
        queueMicrotask(executeFunc);
      } else {
        executeFunc();
      }
    }
  }) as T,
  cancel: cancelCallback,
  getLastArguments: () => funcArgs,
  flushSync: () => {
    if (!isCanceled && isSheduled) {
      func.apply(this, funcArgs);
      cancelCallback();
    }
  },
  async: false
  };
  return result;
}
