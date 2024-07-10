import { Base, EventBase } from "./base";
import { property } from "./jsonobject";

class SurveyTaskModel {
  private timestamp: Date;
  constructor(public type: string) {
    this.timestamp = new Date();
  }
}

export class SurveyTaskManagerModel extends Base {
  private taskList: SurveyTaskModel[] = [];
  constructor() {
    super();
  }

  private onAllTasksCompleted: EventBase<SurveyTaskManagerModel> = this.addEvent<SurveyTaskManagerModel>();
  //@property() text: string;
  @property({ defaultValue: false }) hasActiveTasks: boolean;

  public runTask(type: string, func: (done: any) => void): SurveyTaskModel {
    const task = new SurveyTaskModel(type);
    this.taskList.push(task);
    this.hasActiveTasks = true;
    func(() => this.taskFinished(task));
    return task;
  }

  public waitAndExecute(action: any): void {
    if(!this.hasActiveTasks) {
      action();
      return;
    }
    this.onAllTasksCompleted.add(()=> { action(); });
  }

  private taskFinished(task: SurveyTaskModel) {
    const index = this.taskList.indexOf(task);
    if (index > -1) {
      this.taskList.splice(index, 1);
    }
    if(this.hasActiveTasks && this.taskList.length == 0) {
      this.hasActiveTasks = false;
      this.onAllTasksCompleted.fire(this, {});
    }
  }
}