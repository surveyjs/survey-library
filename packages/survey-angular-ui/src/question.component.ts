import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Question } from "survey-core";
import { AngularComponentFactory } from "./component-factory";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";

@Component({
  selector: "sv-ng-question",
  templateUrl: "./question.component.html"
})
export class QuestionComponent extends EmbeddedViewContentComponent {
  @Input() model!: Question;
  @ViewChild("elementContainer") rootEl?: ElementRef<HTMLDivElement>;
  protected getModel(): Question {
    return this.model;
  }
  ngAfterViewInit(): void {
    this.model.afterRender(this.rootEl?.nativeElement);
  }
  public getComponentName(): string {
    if (this.model.customWidget) return "survey-customwidget";
    if (this.model.isDefaultRendering()) {
      return this.model.getTemplate() + "-question";
    }
    return this.model.getComponentName();
  }
}

AngularComponentFactory.Instance.registerComponent("question", QuestionComponent);