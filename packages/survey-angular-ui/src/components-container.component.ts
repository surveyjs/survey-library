import { Component, Input, TemplateRef, ViewContainerRef, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { SurveyModel } from "survey-core";
import { AngularComponentFactory } from "./component-factory";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";

@Component({
  selector: "sv-components-container, [sv-components-container], sv-ng-components-container",
  templateUrl: "./components-container.component.html",
  styleUrls: ["./hide-host.scss"]
})
export class ComponentsContainerComponent extends EmbeddedViewContentComponent {
  @Input() survey!: SurveyModel;
  @Input() container!: string;
  get components(): Array<any> {
    return this.survey.getContainerContent(this.container as any);
  }
}
AngularComponentFactory.Instance.registerComponent("sv-components-container", ComponentsContainerComponent);