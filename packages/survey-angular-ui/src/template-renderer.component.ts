import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { ButtonGroupItemModel, PanelModel, Question, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";

@Component({
  selector: "sv-template-renderer",
  templateUrl: "./template-renderer.component.html"
})
export class TemplateRendererComponent extends EmbeddedViewContentComponent {
  @Input() componentName!: string;
  @Input() componentData!: any;
}
AngularComponentFactory.Instance.registerComponent(SurveyModel.TemplateRendererComponentName, TemplateRendererComponent);