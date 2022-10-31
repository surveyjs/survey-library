import { Component, Input } from "@angular/core";
import { Base, SurveyTimerModel } from "survey-core";
import { BaseAngular } from "../../base-angular";

@Component(
  {
    selector: "sv-timer-panel",
    template: "<div class='model.survey.getCss().timerRoot'>{{model.text}}</div>"
  }
)

export class TimerPanelComponent extends BaseAngular<SurveyTimerModel> {
  @Input() model!: SurveyTimerModel;

  protected getStateElement(): Base {
    return this.model;
  }
  protected getModel(): SurveyTimerModel {
    return this.model;
  }
}
