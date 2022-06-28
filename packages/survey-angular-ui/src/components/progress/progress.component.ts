import { Component, DoCheck, Input, ViewContainerRef } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { SurveyProgressModel } from "survey-core";

@Component({
  selector: "sv-ng-progress",
  template: "<ng-template [component]='{ name: componentName, data: { model } }'></ng-template>"
})
export class ProgressComponent {
  @Input() model: any;
  get componentName(): string {
    return "sv-progress-" + this.model.progressBarType;
  }
}