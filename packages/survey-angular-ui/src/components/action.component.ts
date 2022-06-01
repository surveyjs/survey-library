import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { SurveyModel, PageModel } from "survey-core";

@Component({
  selector: "sv-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"]
})
export class ActionComponent extends BaseAngular {
  @Input() model: any;
  getModel() {
    return this.model;
  }
}