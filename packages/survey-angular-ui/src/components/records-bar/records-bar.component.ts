import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";
import { QuestionRecordsBar } from "survey-core";

// The bar under the records of a dynamic panel and a dynamic matrix: the pager, and the sort menu under it.
@Component({
  selector: "sv-ng-records-bar",
  templateUrl: "./records-bar.component.html",
  styles: [":host { display: none }"]
})
export class RecordsBarComponent extends BaseAngular<QuestionRecordsBar> {
  @Input() model!: QuestionRecordsBar;
  getModel(): QuestionRecordsBar {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-records-bar", RecordsBarComponent);
