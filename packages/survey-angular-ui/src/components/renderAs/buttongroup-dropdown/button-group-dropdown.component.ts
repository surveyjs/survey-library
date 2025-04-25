import { Component, Input } from "@angular/core";
import { RendererFactory } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-ng-buttongroup-dropdown-question",
  templateUrl: "./button-group-dropdown.component.html"
})

export class ButtonGroupDropdownComponent {
  @Input() model: any;
}

AngularComponentFactory.Instance.registerComponent("buttongroup-dropdown", ButtonGroupDropdownComponent);

RendererFactory.Instance.registerRenderer(
  "buttongroup",
  "dropdown",
  "buttongroup-dropdown"
);