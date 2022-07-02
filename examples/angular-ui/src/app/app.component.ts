import {  Component } from "@angular/core";
import { StylesManager } from "survey-core";
const json = require("../assets/survey.json");

StylesManager.applyTheme("default");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  public isTest = !!(<any>window)["%hammerhead%"];
}
