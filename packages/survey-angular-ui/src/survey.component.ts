import { Component, DoCheck, ElementRef, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { surveyBuiltInVarible, SurveyModel, SvgRegistry } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
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
  ngOnInit() {
    if(this.model["needRenderIcons"]) {
      SvgRegistry.renderIcons();
    }
  }
  ngAfterViewInit() {
    this.model.afterRenderSurvey(this.rootEl.nativeElement);
  }
}