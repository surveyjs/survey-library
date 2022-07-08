import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { RendererFactory } from "survey-core";

@Component({
  selector: "sv-ng-dropdown-select-question",
  templateUrl: "./dropdown-select.component.html"
})
export class DropdownSelectComponent {
  @Input() model: any;
}

AngularComponentFactory.Instance.registerComponent("dropdown-select-question", DropdownSelectComponent);
RendererFactory.Instance.registerRenderer("dropdown", "select", "dropdown-select-question");