import { Component, Input } from "@angular/core";
import { SurveyModel, PageModel } from "survey-core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "question-skeleton",
  templateUrl: "./skeleton.component.html",
  styleUrls: ["./skeleton.component.scss"]
})
export class QuestionSkeletonComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}