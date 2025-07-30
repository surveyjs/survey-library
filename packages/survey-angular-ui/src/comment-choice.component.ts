import { Component, Input } from "@angular/core";
import { ItemValue, Question, QuestionSelectBase, TextAreaModel } from "survey-core";

@Component({
  selector: "sv-ng-comment-choice, '[sv-ng-comment-choice]'",
  templateUrl: "./comment-choice.component.html",
})
export class SurveyCommentChoiceComponent {
  @Input() question!: Question;
  @Input() item!: ItemValue;
  constructor() {
  }
  public get commentValue(): string {
    return (<QuestionSelectBase>this.question).getCommentValue(this.item);
  }
  public get textAreaModel(): TextAreaModel {
    return (<QuestionSelectBase>this.question).getCommentTextAreaModel(this.item);
  }
}