
import { Component } from "@angular/core";
import { QuestionAngular } from "../../question";
import { QuestionButtonGroupModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-buttongroup-question",
  templateUrl: "./button-group.component.html"
})
export class ButtonGroupQuestionComponent extends QuestionAngular<QuestionButtonGroupModel> {
}
AngularComponentFactory.Instance.registerComponent("buttongroup-question", ButtonGroupQuestionComponent);