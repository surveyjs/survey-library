import { Component, Directive, Input } from "@angular/core";
import { QuestionSelectBase } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "['sv-ng-selectbase']",
  templateUrl: "./selectbase.component.html"
})
export class SelectBaseComponent {
  @Input() model!: any;
  @Input() inputType: string = "checkbox";
  @Input() showLegend: boolean = true;
  constructor() {
  }
}

AngularComponentFactory.Instance.registerComponent("selectbase", SelectBaseComponent);