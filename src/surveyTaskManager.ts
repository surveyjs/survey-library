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
  //@property() text: string;
  @property({ defaultValue: false }) hasActiveTasks: boolean;

  public taskStarted(type: string): SurveyTaskModel {
    const task = new SurveyTaskModel(type);
    this.taskList.push(task);
    this.hasActiveTasks = true;
    return task;
  }

  public taskFinished(task: SurveyTaskModel) {
    const index = this.taskList.indexOf(task);
    if (index > -1) {
      this.taskList.splice(index, 1);
    }
    this.hasActiveTasks = !!this.taskList.length;
  }
}