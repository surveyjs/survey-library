import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { SurveyError } from "survey-core";

@Component({
  selector: "sv-question-error",
  templateUrl: "./question-error.component.html"
})
export class QuestionErrorComponent {
  @Input() error!: SurveyError;
  @Input() cssClasses?: any;
  @Input() element: any;
}
AngularComponentFactory.Instance.registerComponent("sv-question-error", QuestionErrorComponent);