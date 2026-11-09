export interface IUpdateTask {
  priority: number;
  callback: () => void;
  after?: () => void;
}
export interface IUpdateManager {
  addTask(task: IUpdateTask): void;
  hasTask(task: IUpdateTask): boolean;
}
export class UpdateManager implements IUpdateManager {
  private tasks: Set<IUpdateTask> = new Set();
  addTask(task: IUpdateTask) {
    this.tasks.add(task);
    this.tick();
  }
  hasTask(task: IUpdateTask) {
    return this.tasks.has(task);
  }
  private isSheduled: boolean = false;
  tick() {
    if (!this.isSheduled) {
      this.isSheduled = true;
      queueMicrotask(() => {
        const tasks = [...this.tasks].sort((a, b) => a.priority - b.priority);
        const afterCallbacks = new Set<() => void>();
        for (const task of tasks) {
          if (task.after) {
            afterCallbacks.add(task.after);
          }
        }
        this.isSheduled = false;
        for (const task of tasks) {
          if (task.after) {
            afterCallbacks.add(task.after);
          }
          this.tasks.delete(task);
          task.callback();
        }
        for (const callback of afterCallbacks) {
          callback();
        }
      });
    }
  }
}
let updateManager: UpdateManager | undefined = undefined;
export function getUpdateManager(): IUpdateManager {
  if (!updateManager) {
    updateManager = new UpdateManager();
  }
  return updateManager;
}