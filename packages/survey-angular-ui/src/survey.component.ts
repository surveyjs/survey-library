import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "survey",
  template: "<sv-ng-modal-container></sv-ng-modal-container><survey-content [model]='model'></survey-content>"
  })
export class SurveyComponent extends BaseAngular<SurveyModel> {
  @Input() model!: SurveyModel;
  protected getModel(): SurveyModel {
    return this.model;
  }
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    changeDetectorRef.detach();
  }
  protected override getShouldReattachChangeDetector(): boolean {
    return false;
  }
  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
  }
}