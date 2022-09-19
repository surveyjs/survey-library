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
  protected get elementComponentName(): string {
    return this.model.isPanel ? "panel": "question";
  }
  public get componentName(): string {
    const survey = this.surveyModel as SurveyModel;
    if(!!survey) {
      const name = survey.getElementWrapperComponentName(this.model);
      if(!!name) {
        return name;
      }
    }
    return this.elementComponentName;
  }
  public get componentData(): any {
    const survey = this.surveyModel as SurveyModel;
    let data: any;
    if(!!survey) {
      data = survey.getElementWrapperComponentData(this.model);
    }
    return {
      componentName: this.elementComponentName,
      componentData: {
        model: this.model,
        data: data
      }
    };
  }
}