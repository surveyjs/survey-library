import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { SurveyProgressModel } from "survey-core";
import { BaseAngular } from "../../../base-angular";

@Component({
  selector: "sv-ng-progress-default",
  templateUrl: "./progress.component.html"
})
export class ProgressDefaultComponent extends BaseAngular {
  @Input() container?: string;
  @Input() model: any;
  constructor(changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef) {
    super(changeDetectorRef, viewContainerRef);
  }
  protected getModel() {
    return this.model;
  }
  getProgressTextInBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextInBarCss(css);
  }
  getProgressTextUnderBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextUnderBarCss(css);
  }
}
AngularComponentFactory.Instance.registerComponent("sv-progress-progress", ProgressDefaultComponent);
AngularComponentFactory.Instance.registerComponent("sv-progress-pages", ProgressDefaultComponent);
AngularComponentFactory.Instance.registerComponent("sv-progress-questions", ProgressDefaultComponent);
AngularComponentFactory.Instance.registerComponent("sv-progress-correctquestions", ProgressDefaultComponent);
AngularComponentFactory.Instance.registerComponent("sv-progress-requiredquestions", ProgressDefaultComponent);