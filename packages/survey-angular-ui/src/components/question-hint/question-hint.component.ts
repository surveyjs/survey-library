import { Component, Input } from "@angular/core";
import { Question, KeyboardHintModel } from "survey-core";
import { BaseAngular } from "../../base-angular";

@Component({
  selector: "sv-ng-question-hint",
  templateUrl: "./question-hint.component.html",
  // React and Vue render nothing when there are no hints. An inline host still
  // keeps a line box under the question, which shifts the presets layout.
  styles: [":host { display: contents; }"]
})
export class QuestionHintComponent extends BaseAngular<Question> {
  @Input() question!: Question;
  protected getModel(): Question {
    return this.question;
  }
  get keyboardHintModel(): KeyboardHintModel {
    return this.question.getKeyboardHintModel();
  }
}
