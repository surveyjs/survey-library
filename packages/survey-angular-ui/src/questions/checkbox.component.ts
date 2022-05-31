import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-ng-checkbox-question",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"]
})
export class CheckboxComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}

AngularComponentFactory.Instance.registerComponent("checkbox-question", CheckboxComponent);