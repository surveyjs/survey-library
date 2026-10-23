import { Component, Input } from "@angular/core";
import { Question } from "survey-core";
import { BaseAngular } from "../../base-angular";

@Component({
  selector: "sv-ng-question-hint",
  templateUrl: "./question-hint.component.html"
})
export class QuestionHintComponent extends BaseAngular<Question> {
  @Input() question!: Question;
  protected getModel(): Question {
    return this.question;
  }
}
