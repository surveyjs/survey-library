import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "survey",
  template: "<survey-content [model]='model'></survey-content>"
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
  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
  }
}