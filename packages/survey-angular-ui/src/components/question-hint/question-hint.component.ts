import { Component, Input } from "@angular/core";
import { Question, KeyboardHintModel } from "survey-core";

// A plain component: the question's own element re-checks this view on every change.
// A subscribed BaseAngular would disable the question's rerender event when *ngIf removes it.
@Component({
  selector: "sv-ng-question-hint",
  templateUrl: "./question-hint.component.html",
  // React and Vue render nothing when there are no hints. An inline host still
  // keeps a line box under the question, which shifts the presets layout.
  styles: [":host { display: contents; }"]
})
export class QuestionHintComponent {
  @Input() question!: Question;
  get keyboardHintModel(): KeyboardHintModel {
    return this.question.getKeyboardHintModel();
  }
  trackByIndex(index: number): number {
    return index;
  }
}
