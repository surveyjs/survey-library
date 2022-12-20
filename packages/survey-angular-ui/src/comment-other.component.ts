import { Component, Input } from "@angular/core";
import { QuestionSelectBase } from "survey-core";

@Component({
  selector: "sv-ng-comment-other, '[sv-ng-comment-other]'",
  templateUrl: "./comment-other.component.html",
})
export class SurveyCommentOtherComponent {
  @Input() question!: QuestionSelectBase;
  constructor() {
  }
  public get otherValue(): string {
    if(!this.question.otherValue) return "";
    return this.question.otherValue;
  }
}