import { ChangeDetectorRef, Component, Inject, Input, Optional, ViewContainerRef } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { SurveyProgressModel } from "survey-core";
import { BaseAngular } from "../../../base-angular";
import { COMPONENT_DEPTH, SurveyBaseProviders } from "../../../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-progress-default",
  templateUrl: "./progress.component.html"
})
export class ProgressDefaultComponent extends BaseAngular {
  @Input() container?: string;
  @Input() model: any;
  constructor(changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef, @Optional() @Inject(COMPONENT_DEPTH) depth?: number | null) {
    super(changeDetectorRef, viewContainerRef, depth);
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