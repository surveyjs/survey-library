import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Question, SurveyElement } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-question",
  templateUrl: "./question.component.html"
})
export class QuestionComponent {
  @Input() model!: Question;
  @ViewChild("elementContainer") rootEl?: ElementRef<HTMLDivElement>;
  ngAfterViewInit(): void {
    this.model.afterRender(this.rootEl?.nativeElement);
  }
}

AngularComponentFactory.Instance.registerComponent("question", QuestionComponent);