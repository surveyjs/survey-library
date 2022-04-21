import { Component } from "@angular/core";
import { SurveyModel, StylesManager } from "survey-core";

const json = require("../assets/survey.json");

StylesManager.applyTheme("defaultV2");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "angular-ui";
  model = new SurveyModel(json);
}
