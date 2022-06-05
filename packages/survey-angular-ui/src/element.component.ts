import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { SurveyElement } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "'[sv-ng-element]'",
  template: "<ng-template #elementContainer></ng-template>"
})
export class ElementComponent extends BaseAngular<SurveyElement> {
  @Input() model!: SurveyElement;
  @ViewChild("elementContainer", { static: true, read: ViewContainerRef }) elementContainerRef!: ViewContainerRef;
  protected getModel(): SurveyElement {
    return this.model;
  }
  ngOnInit() {
    const component = AngularComponentFactory.Instance.create(this.elementContainerRef, this.model.isPanel ? "panel" : "question");
    (<any>component.instance).model = this.model;
  }
}