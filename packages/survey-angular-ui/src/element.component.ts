import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { ButtonGroupItemModel, PanelModel, Question, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";

@Component({
  selector: "sv-ng-element",
  templateUrl: "./element.component.html"
})
export class ElementComponent extends BaseAngular<PanelModel | Question> {
  @Input() model!: PanelModel | Question;
  protected getModel(): PanelModel | Question {
    return this.model;
  }
  public get componentName(): string {
    const survey = this.surveyModel as SurveyModel;
    if(!!survey) {
      return survey.getElementWrapperComponentName(this.model);
    }
    return this.model.isPanel ? "panel": "question";
  }
  public get componentData(): any {
    const survey = this.surveyModel as SurveyModel;
    if(!!survey) {
      return {
        model: this.model,
        componentData: survey.getElementWrapperComponentData(this.model)
      };
    }
    return { model: this.model };
  }
}