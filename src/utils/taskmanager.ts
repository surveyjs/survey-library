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
export class TaskManger {
  private static instance: TaskManger = undefined;
  private static tasks: Array<IExecutable> = [];
  private constructor(private interval: number = 100) {
    setTimeout(TaskManger.Instance().tick, interval);
  }
  // dispose
  public static Instance() {
    if (!TaskManger.instance) {
      TaskManger.instance = new TaskManger();
    }
    return TaskManger.instance;
  }
  private tick() {
    try {
      var newTasks = [];
      for (var i = 0; i < TaskManger.tasks.length; i++) {
        let task = TaskManger.tasks[i];
        task.execute();
        if (!task.isCompleted) {
          newTasks.push(task);
        } else {
          if (typeof task.dispose === "function") {
            task.dispose();
          }
        }
      }
      TaskManger.tasks = newTasks;
    } finally {
      setTimeout(TaskManger.Instance().tick, this.interval);
    }
  }
  public static schedule(task: IExecutable) {
    TaskManger.tasks.push(task);
  }
}

export function debounce<T extends (...args: any) => void>(func: T): { run: T, cancel: () => void } {
  let isSheduled = false;
  let isCanceled = false;
  let funcArgs: any;
  return { run: ((...args: any) => {
    isCanceled = false;
    funcArgs = args;
    if(!isSheduled) {
      isSheduled = true;
      queueMicrotask(() => {
        if(!isCanceled) {
          func.apply(this, funcArgs);
        }
        isCanceled = false;
        isSheduled = false;
      });
    }
  }) as T, cancel: () => {
    isCanceled = true;
  } };
}
