import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { SurveyModel, ProgressButtons, Base } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";
import { BaseAngular } from "../../../base-angular";

@Component({
  selector: "sv-ng-progress-buttons",
  templateUrl: "./progress.component.html"
})
export class ProgressButtonsComponent extends BaseAngular {
  @Input() model!: ProgressButtons;
  @Input() survey!: SurveyModel;
  @Input() container!: string;
  constructor(changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef) {
    super(changeDetectorRef, viewContainerRef);
  }
  protected getModel(): Base {
    return this.model;
  }
}
AngularComponentFactory.Instance.registerComponent("sv-progress-buttons", ProgressButtonsComponent);
