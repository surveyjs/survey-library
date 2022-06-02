
import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { RendererFactory } from "survey-core";

@Component({
  selector: "sv-ng-boolean-checkbox-question",
  templateUrl: "./boolean-checkbox.component.html"
})
export class BooleanCheckboxComponent {
  @Input() model: any;
}

AngularComponentFactory.Instance.registerComponent("boolean-checkbox-question", BooleanCheckboxComponent);
RendererFactory.Instance.registerRenderer(
  "boolean",
  "checkbox",
  "boolean-checkbox-question"
);
