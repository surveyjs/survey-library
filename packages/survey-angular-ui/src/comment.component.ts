import { Component, Input } from "@angular/core";
import { Question } from "survey-core";

@Component({
  selector: "sv-ng-comment, '[sv-ng-comment]'",
  templateUrl: "./comment.component.html",
})
export class SurveyCommentComponent {
  @Input() question!: Question;
  constructor() {
  }
}