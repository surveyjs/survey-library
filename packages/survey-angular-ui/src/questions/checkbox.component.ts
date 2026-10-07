import { Component } from "@angular/core";
import { QuestionCheckboxModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SelectBaseComponent } from "./selectbase.component";

@Component({
  selector: "sv-ng-checkbox-question",
  templateUrl: "./selectbase.component.html"
})
export class CheckboxComponent extends SelectBaseComponent<QuestionCheckboxModel> {
  public override onRootKeyDown(event: any): void {
    this.model.onKeyDown?.(event);
  }
}

AngularComponentFactory.Instance.registerComponent("checkbox-question", CheckboxComponent);