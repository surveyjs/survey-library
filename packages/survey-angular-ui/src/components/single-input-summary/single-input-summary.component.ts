import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { QuestionSingleInputSummary } from "survey-core";

@Component({
  selector: "sv-single-input-summary",
  templateUrl: "./single-input-summary.component.html"
})
export class SingleInputSummaryComponent extends BaseAngular<any> {
  @Input() summary!: QuestionSingleInputSummary;
  @Input() css!: any;

  protected getModel(): any {
    return this.summary;
  }
}