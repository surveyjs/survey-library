import { Component, Input } from "@angular/core";
import { Base, SurveyTimerModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component(
  {
    selector: "sv-timerpanel",
    templateUrl: "./timer-panel.component.html",
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

AngularComponentFactory.Instance.registerComponent("sv-timerpanel", TimerPanelComponent);