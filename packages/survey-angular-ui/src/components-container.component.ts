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
  @Input() needRenderWrapper?: boolean;
  get components(): Array<any> {
    return this.survey.getContainerContent(this.container as any);
  }
  get isNeedRenderWrapper(): boolean {
    return this.needRenderWrapper === false ? false : true;
  }
}
AngularComponentFactory.Instance.registerComponent("sv-components-container", ComponentsContainerComponent);