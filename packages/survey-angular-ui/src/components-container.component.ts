import { Component, Input, TemplateRef, ViewContainerRef, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { ISurveyLayoutElementGroup, SurveyModel } from "survey-core";
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
  get groups(): Array<ISurveyLayoutElementGroup> {
    return this.survey.getContainerContentGroups(this.container as any);
  }
  get isNeedRenderWrapper(): boolean {
    return this.needRenderWrapper === false ? false : true;
  }
  // groups builds new objects on every check; tracking by key keeps the rendered components.
  trackGroupByKey(_: number, group: ISurveyLayoutElementGroup): string {
    return group.key;
  }
}
AngularComponentFactory.Instance.registerComponent("sv-components-container", ComponentsContainerComponent);
