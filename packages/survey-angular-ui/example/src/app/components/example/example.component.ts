import { Component, ViewEncapsulation } from "@angular/core";
import { SurveyModel, StylesManager } from "survey-core";
const json = {
  showQuestionNumbers: "off",
  questions: [
    {
      type: "ranking",
      name: "ranking_question",
      itemComponent: "new-item-content",
      choices: ["item1", "item2", "item3", "item4"],
      readOnly: "true"
    }
  ]
};
@Component({
  selector: "example",
  templateUrl: "./example.component.html",
  styleUrls: ["./example.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ExampleComponent {
  title = "angular-ui";

  model: SurveyModel;

  constructor() {
    this.model = new SurveyModel(json);
    (<any>window).survey = this.model;
  }
}
