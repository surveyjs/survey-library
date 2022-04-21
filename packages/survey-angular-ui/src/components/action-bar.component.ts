import { Component, Input } from "@angular/core";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-action-bar",
  templateUrl: "./action-bar.component.html",
  styleUrls: ["./action-bar.component.scss"]
})
export class ActionBarComponent {
  @Input() model: any;
  @Input() handleClick: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
  onClick(): boolean | void {
    return this.handleClick ? true : undefined;
  }
}