import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-ng-text-question",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.scss"]
})
export class TextQuestionComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}

AngularComponentFactory.Instance.registerComponent("text-question", TextQuestionComponent);