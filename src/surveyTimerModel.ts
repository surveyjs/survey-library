import { ISurvey } from "./base-interfaces";
import { Base } from "./base";
import { SurveyTimer } from "./surveytimer";
import { property } from "./jsonobject";
import { PageModel } from "./page";

export interface ISurveyTimerText {
  timerInfoText: string;
}

export class SurveyTimerModel extends Base {
  public onTimer: (page: PageModel) => void;
  private surveyValue: ISurvey;
  constructor(survey: ISurvey) {
    super();
    this.surveyValue = survey;
  }
  @property() text: string;
  @property({ defaultValue: 0 }) spent: number;
  public get survey(): ISurvey { return this.surveyValue; }
  private timerFunc: any = null;
  public start(): void {
    if(!this.survey) return;
    if (this.isRunning || this.isDesignMode) return;
    this.timerFunc = (): void => { this.doTimer(); };
    this.setIsRunning(true);
    this.updateText();
    SurveyTimer.instance.start(this.timerFunc);
  }
  public stop(): void {
    if (!this.isRunning) return;
    this.setIsRunning(false);
    SurveyTimer.instance.stop(this.timerFunc);
  }
  public get isRunning(): boolean {
    return this.getPropertyValue("isRunning", false);
  }
  private setIsRunning(val: boolean): void {
    this.setPropertyValue("isRunning", val);
  }
  private doTimer(): void {
    var page = <PageModel>this.survey.currentPage;
    if (page) {
      page.timeSpent = page.timeSpent + 1;
    }
    this.spent = this.spent + 1;
    this.updateText();
    if(this.onTimer) {
      this.onTimer(page);
    }
  }
  private updateText(): void {
    this.text = (<ISurveyTimerText><any>this.survey).timerInfoText;
  }
  private get isDesignMode(): boolean {
    return this.survey && this.survey.isDesignMode;
  }
}