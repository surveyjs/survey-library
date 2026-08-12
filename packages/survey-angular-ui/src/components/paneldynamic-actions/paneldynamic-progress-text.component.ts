import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { Action, QuestionPanelDynamicModel } from "survey-core";
@Component({
  selector: "sv-ng-paneldynamic-progress-text",
  templateUrl: "./paneldynamic-progress-text.component.html"
})
export class PanelDynamicProgressText {
  @Input() data: any;
  @Input() model!: Action;
  public get question(): QuestionPanelDynamicModel {
    return (this.model && this.model.data.question) || this.data.question;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-paneldynamic-progress-text", PanelDynamicProgressText);