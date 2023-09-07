import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { SurveyProgressModel } from "survey-core";
import { EmbeddedViewContentComponent } from "../../../embedded-view-content.component";

@Component({
  selector: "sv-ng-progress-default",
  templateUrl: "./progress.component.html"
})
export class ProgressDefaultComponent extends EmbeddedViewContentComponent {
  @Input() container?: string;
  @Input() model: any;
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