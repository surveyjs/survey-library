import { Component, Input } from "@angular/core";
import { Question, QuestionSelectBase, TextAreaModel } from "survey-core";

@Component({
  selector: "sv-ng-comment-other, '[sv-ng-comment-other]'",
  templateUrl: "./comment-other.component.html",
})
export class SurveyCommentOtherComponent {
  @Input() question!: Question;
  constructor() {
  }
  public get otherValue(): string {
    const val = (<QuestionSelectBase>this.question).otherValue;
    return !!val ? val : "";
  }
  public get textAreaModel(): TextAreaModel {
    return (<QuestionSelectBase>this.question).otherTextAreaModel;
  }
}