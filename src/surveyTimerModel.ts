import { ISurvey } from "./base-interfaces";
import { Base, EventBase } from "./base";
import { SurveyTimer } from "./surveytimer";
import { property } from "./jsonobject";
import { PageModel } from "./page";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export interface ISurveyTimerText {
  timerInfoText: string;
  timerInfo: { spent: number, limit: number };
  timerClockText: string;
  getCss(): any;
  isTimerPanelShowingOnBottom: boolean;
  isTimerPanelShowingOnTop: boolean;
  onCurrentPageChanged: EventBase<SurveyModel>;
}

export class SurveyTimerModel extends Base {
  public onTimer: (page: PageModel) => void;
  private surveyValue: ISurvey;
  constructor(survey: ISurvey) {
    super();
    this.surveyValue = survey;
    this.onCreating();
  }
  @property() text: string;
  @property() progress: number;
  @property() clockText: string;
  @property({ defaultValue: 0 }) spent: number;
  public get survey(): ISurveyTimerText { return <any>this.surveyValue; }
  public onCreating(): void {}
  private timerFunc: any = null;
  public start(): void {
    if(!this.survey) return;
    if (this.isRunning || this.isDesignMode) return;
    this.survey.onCurrentPageChanged.add(() => {
      this.update();
    });
    this.timerFunc = (): void => { this.doTimer(); };
    this.setIsRunning(true);
    this.update();
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
  private update() {
    this.updateText();
    this.updateProgress();
  }
  private doTimer(): void {
    var page = <PageModel>(<ISurvey><any>this.survey).currentPage;
    if (page) {
      page.timeSpent = page.timeSpent + 1;
    }
    this.spent = this.spent + 1;
    this.update();
    if(this.onTimer) {
      this.onTimer(page);
    }
  }
  private updateProgress() {
    let { spent, limit } = this.survey.timerInfo;
    if(spent == 0) {
      this.progress = 0;
      setTimeout(() => {
        this.progress = Math.floor((spent + 1)/limit * 100) / 100;
      }, 0);
    }
    else if(spent !== limit) {
      this.progress = Math.floor((spent + 1)/limit * 100) / 100;
    }
  }
  private updateText(): void {
    this.clockText = this.survey.timerClockText;
    this.text = this.survey.timerInfoText;
  }
  public get showTimerAsClock(): boolean {
    return !!this.survey.getCss().clockTimerRoot;
  }

  public get rootCss(): string {
    return new CssClassBuilder()
      .append(this.survey.getCss().clockTimerRoot)
      .append(this.survey.getCss().clockTimerRootTop, this.survey.isTimerPanelShowingOnTop)
      .append(this.survey.getCss().clockTimerRootBottom, this.survey.isTimerPanelShowingOnBottom)
      .toString();
  }
  public getProgressCss(): string {
    return new CssClassBuilder()
      .append(this.survey.getCss().clockTimerProgress)
      .append(this.survey.getCss().clockTimerProgressAnimation, this.progress > 0)
      .toString();
  }
  public get textCss(): string {
    return this.survey.getCss().clockTimerText;
  }
}