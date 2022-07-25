
import { Component } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { QuestionAngular } from "../question";
import { PanelModel, QuestionCompositeModel } from "survey-core";

@Component({
  selector: "sv-ng-composite-question",
  template: "<sv-ng-panel [model]='contentPanel'></sv-ng-panel>"
})
export class CompositeQuestionComponent extends QuestionAngular<QuestionCompositeModel> {
  get contentPanel(): PanelModel {
    return this.model.contentPanel;
  }
}
AngularComponentFactory.Instance.registerComponent("composite-question", CompositeQuestionComponent);
