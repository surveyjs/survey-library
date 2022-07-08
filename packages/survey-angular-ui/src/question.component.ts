import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Question } from "survey-core";
import { AngularComponentFactory } from "./component-factory";
import { NoRootComponent } from "./no-root-component";

@Component({
  selector: "sv-ng-question",
  templateUrl: "./question.component.html"
})
export class QuestionComponent extends NoRootComponent {
  @Input() model!: Question;
  @ViewChild("elementContainer") rootEl?: ElementRef<HTMLDivElement>;
  protected getModel(): Question {
    return this.model;
  }
  ngAfterViewInit(): void {
    this.model.afterRender(this.rootEl?.nativeElement);
  }
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

AngularComponentFactory.Instance.registerComponent("question", QuestionComponent);