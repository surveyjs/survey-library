import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { PopupSurveyModel, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "popup-survey",
  templateUrl: "./popup.survey.component.html",
  styleUrls: ["./popup.survey.component.scss"]
})
export class PopupSurveyComponent extends BaseAngular<PopupSurveyModel> {
  @Input() model!: PopupSurveyModel;
  protected getModel(): PopupSurveyModel {
    return this.model;
  }
  public get survey(): SurveyModel {
    return this.model.survey;
  }
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    changeDetectorRef.detach();
  }
  protected override onModelChanged(): void {
    this.model.isShowing = true;
    this.changeDetectorRef.detectChanges();
  }
}