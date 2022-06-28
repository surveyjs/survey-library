import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { SurveyElement } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "'[sv-ng-element]'",
  template: "<ng-template [component]='{ name: componentName, data: { model } }'></ng-template>"
})
export class ElementComponent extends BaseAngular<SurveyElement> {
  @Input() model!: SurveyElement;
  protected getModel(): SurveyElement {
    return this.model;
  }
  get componentName(): string {
    return this.model.isPanel ? "panel" : "question";
  }
}