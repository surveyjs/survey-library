import { Component, Input } from "@angular/core";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "./implementor-base";

@Component({
  selector: "page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"]
})
export class PageComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}