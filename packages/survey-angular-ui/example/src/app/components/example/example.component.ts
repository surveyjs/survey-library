import { Component, ViewEncapsulation } from "@angular/core";
import { SurveyModel, StylesManager } from "survey-core";
const json = require("../../../assets/survey.json");

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
