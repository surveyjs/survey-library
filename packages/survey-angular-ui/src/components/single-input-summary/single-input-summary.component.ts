import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { QuestionSingleInputSummary } from "survey-core";
import { AngularComponentFactory } from "./../../component-factory";

@Component({
  selector: "sv-single-input-summary",
  templateUrl: "./single-input-summary.component.html"
})
export class SingleInputSummaryComponent {
  @Input() model!: QuestionSingleInputSummary;
  @Input() css!: any;

  get placeholderComponent() { return "sv-ng-placeholder-" + this.model.question.getTemplate(); }
  get componentRegistered () { return AngularComponentFactory.Instance.isComponentRegistered(this.placeholderComponent); }
}

AngularComponentFactory.Instance.registerComponent("sv-single-input-summary", SingleInputSummaryComponent);