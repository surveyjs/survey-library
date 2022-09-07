import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { ButtonGroupItemModel, PanelModel, Question, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-template-renderer",
  templateUrl: "./template-renderer.component.html"
})
export class TemplateRendererComponent extends BaseAngular<PanelModel | Question> {
  @Input() model!: PanelModel | Question;
  @Input() componentData?: any;
  protected getModel(): PanelModel | Question {
    return this.model;
  }
  public get componentName(): string {
    return this.model.isPanel ? "panel": "question";
  }
}
AngularComponentFactory.Instance.registerComponent(SurveyModel.TemplateRendererComponentName, TemplateRendererComponent);