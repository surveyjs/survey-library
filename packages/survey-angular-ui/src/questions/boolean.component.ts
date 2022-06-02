import { Component, Input } from "@angular/core";
import { QuestionBooleanModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-boolean-question",
  templateUrl: "./boolean.component.html"
})
export class BooleanQuestionComponent {
  @Input() model!: QuestionBooleanModel;
  constructor() {}
  onChange(event: any) {
    this.model.checkedValue = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent("boolean-question", BooleanQuestionComponent);