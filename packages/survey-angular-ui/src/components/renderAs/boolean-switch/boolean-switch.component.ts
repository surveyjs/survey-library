
import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { QuestionBooleanModel, RendererFactory } from "survey-core";

@Component({
  selector: "sv-ng-boolean-switch-question",
  templateUrl: "./boolean-switch.component.html"
})
export class BooleanSwitchComponent {
  @Input() model!: QuestionBooleanModel;
  public onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest?.(".sd-action-bar")) return;
    this.model.booleanValue = !this.model.booleanValue;
  }
}

AngularComponentFactory.Instance.registerComponent("boolean-switch-question", BooleanSwitchComponent);
RendererFactory.Instance.registerRenderer(
  "boolean",
  "switch",
  "boolean-switch-question"
);
