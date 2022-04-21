import { Component, Input } from "@angular/core";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-action-bar-item",
  templateUrl: "./action-bar-item.component.html",
  styleUrls: ["./action-bar-item.component.scss"]
})
export class ActionBarItemComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}