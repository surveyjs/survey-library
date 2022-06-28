import { Component, DoCheck, Input, OnInit, ViewContainerRef } from "@angular/core";
import { QuestionSkeletonComponent } from "./components/skeleton.component";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-element-content",
  template: "<ng-template [component]='{ name: getComponentName(), data: { model: model }, default: defaultComponentName }'> </ng-template>"
})
export class QuestionContentComponent {
  @Input() model: any;
  defaultComponentName = "skeleton-question";
  public getComponentName(): string {
    if (
      this.model.customWidget &&
      !this.model.customWidget.widgetJson.isDefaultRender
    )
      return "survey-widget-" + this.model.customWidget.name;
    if (this.model.isDefaultRendering()) {
      return this.model.getType() + "-question";
    }
    return this.model.getComponentName();
  }
}