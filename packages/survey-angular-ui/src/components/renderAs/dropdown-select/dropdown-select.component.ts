import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { RendererFactory } from "survey-core";

@Component({
  selector: "sv-ng-dropdown-select-question",
  templateUrl: "./dropdown-select.component.html"
})
export class DropdownSelectComponent {
  @Input() model: any;

  get editableValue() {
    return this.model.renderedValue || "";
  }
  set editableValue(newValue: any) {
    if(newValue === "") {
      this.model.renderedValue = undefined;
    } else {
      this.model.renderedValue = newValue;
    }
  }

  click(event: any) {
    this.model.onClick(event);
  }
  keyup(event: any) {
    this.model.onKeyUp(event);
  }
}

AngularComponentFactory.Instance.registerComponent("dropdown-select-question", DropdownSelectComponent);
RendererFactory.Instance.registerRenderer("dropdown", "select", "dropdown-select-question");