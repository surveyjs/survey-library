import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"],
})
export class SurveyComponent extends BaseAngular {
  @Input() model!: SurveyModel;
  @ViewChild("surveyContainer", { static: false }) rootEl!: ElementRef<HTMLDivElement>;
  protected getModel(): SurveyModel {
    return this.model;
  }

  ngAfterViewInit() {
    this.model.afterRenderSurvey(this.rootEl.nativeElement);
  }
}