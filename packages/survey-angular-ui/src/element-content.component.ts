import { Component, Input } from "@angular/core";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "./implementor-base";

@Component({
  selector: "element-content",
  templateUrl: "./element-content.component.html",
  styleUrls: ["./element-content.component.scss"]
})
export class ElementContentComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}