import { Component, Input } from "@angular/core";
import { Base, SurveyTimerModel } from "survey-core";
import { BaseAngular } from "../../base-angular";

@Component(
  {
    selector: "sv-timer-panel",
    templateUrl: "./timer-panel.component.html",
    // template: "<div class='model.survey.getCss().timerRoot'>{{model.text}}</div>"
  }
)

export class TimerPanelComponent extends BaseAngular<SurveyTimerModel> {
  @Input() model!: SurveyTimerModel;
  private readonly circleLengthValue = 440;

  protected getStateElement(): Base {
    return this.model;
  }
  protected getModel(): SurveyTimerModel {
    return this.model;
  }
  public get circleLength(): number {
    return this.circleLengthValue;
  }
  public get progress(): number {
    return -this.model.progress * this.circleLength;
  }
}
