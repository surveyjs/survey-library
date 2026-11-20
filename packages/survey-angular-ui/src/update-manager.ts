export interface IUpdateTask {
  priority: number;
  callback: () => void;
  after?: () => void;
}
export interface IUpdateManager {
  addTask(task: IUpdateTask): void;
  hasTask(task: IUpdateTask): boolean;
  removeTask(task: IUpdateTask): void;
  completeTask(task: IUpdateTask): void;
}
export class UpdateManager implements IUpdateManager {
  private tasks: Set<IUpdateTask> = new Set();
  addTask(task: IUpdateTask) {
    this.tasks.add(task);
    this.tick();
  }
  removeTask(task: IUpdateTask) {
    this.tasks.delete(task);
    this.pendingTasks?.delete(task);
  }
  completeTask(task: IUpdateTask) {
    const wasInTasks = this.tasks.delete(task);
    const wasPending = !!this.pendingTasks?.delete(task);
    const wasQueued = wasInTasks || wasPending;
    if (wasQueued && task.after) {
      this.afterCallbacks.add(task.after);
    }
  }
  hasTask(task: IUpdateTask) {
    return this.tasks.has(task);
  }
  private pendingTasks: Set<IUpdateTask> | undefined;
  private afterCallbacks: Set<() => void> = new Set();
  private isSheduled: boolean = false;
  tick() {
    if (!this.isSheduled) {
      this.isSheduled = true;
      queueMicrotask(() => {
        this.pendingTasks = new Set([...this.tasks].sort((a, b) => a.priority - b.priority));
        this.isSheduled = false;
        for (const task of this.pendingTasks) {
          if (task.after) {
            this.afterCallbacks.add(task.after);
          }
          this.tasks.delete(task);
          task.callback();
        }
        const afterCallbacks = this.afterCallbacks;
        this.afterCallbacks = new Set();
        for (const callback of afterCallbacks) {
          callback();
        }
        this.pendingTasks = undefined;
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