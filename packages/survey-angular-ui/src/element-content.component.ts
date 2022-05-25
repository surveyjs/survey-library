import { Component, Input, OnInit, ViewContainerRef } from "@angular/core";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "./implementor-base";
import { QuestionSkeletonComponent } from "./components/skeleton.component";
import { TextQuestionComponent } from "./questions/text.component";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-element-content",
  templateUrl: "./element-content.component.html",
  styleUrls: ["./element-content.component.scss"]
})
export class ElementContentComponent implements OnInit {
  @Input() model: any;
  constructor(public viewContainerRef: ViewContainerRef) {

  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
  public getComponentName(): string {
    if (
      this.model.customWidget &&
      !this.model.customWidget.widgetJson.isDefaultRender
    )
      return "survey-widget-" + this.model.customWidget.name;
    return this.model.getType() + "-question";
  }
  ngOnInit() {
    this.viewContainerRef.clear();
    let componentRef = AngularComponentFactory.Instance.create(this.viewContainerRef, this.getComponentName());
    if(!componentRef) {
      componentRef = this.viewContainerRef.createComponent(QuestionSkeletonComponent) as any;
    }
    (componentRef.instance as any).model = this.model;
  }
}