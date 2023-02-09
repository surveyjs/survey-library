import { Component, Input } from "@angular/core";
import { Question, QuestionSelectBase } from "survey-core";

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
  public onOtherValueChange(event: any): void {
    (<QuestionSelectBase>this.question).onOtherValueChange(event);
  }
  public onOtherValueInput(event: any): void {
    (<QuestionSelectBase>this.question).onOtherValueInput(event);
  }
  public get otherId(): string {
    return (<QuestionSelectBase>this.question).otherId;
  }
  public get otherPlaceholder(): string {
    return (<QuestionSelectBase>this.question).otherPlaceholder;
  }
}