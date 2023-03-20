import { Component } from "@angular/core";
const json = require("../assets/survey.json");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  public isTest = !!(<any>window)["%hammerhead%"];
}
