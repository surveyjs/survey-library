import { Component, Input } from "@angular/core";
import { QuestionPanelDynamicModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-placeholder-paneldynamic",
  templateUrl: "./paneldynamicplaceholder.component.html"
})
export class PanelDynamicPlaceholderComponent {
  @Input() question!: QuestionPanelDynamicModel;
}
AngularComponentFactory.Instance.registerComponent("sv-ng-placeholder-paneldynamic", PanelDynamicPlaceholderComponent);