import { ISurvey } from "./base-interfaces";
import { Base, EventBase } from "./base";
import { SurveyTimer } from "./surveytimer";
import { property } from "./jsonobject";
import { PageModel } from "./page";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

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

  public taskStarted(type: string): SurveyTaskModel {
    const task = new SurveyTaskModel(type);
    this.taskList.push(task);
    this.hasActiveTasks = true;
    return task;
  }

  public waitAndExecute(action: any) {
    if(!this.hasActiveTasks) {
      action();
      return;
    }
    this.onAllTasksCompleted.add(()=> { action(); });
  }

  public taskFinished(task: SurveyTaskModel) {
    const index = this.taskList.indexOf(task);
    if (index > -1) {
      this.taskList.splice(index, 1);
    }
    if(this.hasActiveTasks && this.taskList.length == 0) {
      this.hasActiveTasks = true;
      this.onAllTasksCompleted.fire(this, {});
    }
  }
}