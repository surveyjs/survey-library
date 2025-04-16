import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { QuestionSingleInputSummary } from "survey-core";
import { AngularComponentFactory } from "./../../component-factory";

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

  get placeholderComponent() { return "survey-placeholder-" + this.summary.question.getTemplate(); }
  get componentRegistered () { return AngularComponentFactory.Instance.isComponentRegistered(this.placeholderComponent); }

}