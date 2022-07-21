
import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { QuestionBooleanModel, RendererFactory } from "survey-core";

@Component({
  selector: "sv-ng-boolean-radio-question",
  templateUrl: "./boolean-radio.component.html"
})
export class BooleanRadioComponent {
  @Input() model!: QuestionBooleanModel;
}

AngularComponentFactory.Instance.registerComponent("boolean-radio-question", BooleanRadioComponent);
RendererFactory.Instance.registerRenderer(
  "boolean",
  "radio",
  "boolean-radio-question"
);
