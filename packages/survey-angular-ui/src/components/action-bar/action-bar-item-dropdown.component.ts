import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-action-bar-item-dropdown",
  templateUrl: "./action-bar-item-dropdown.component.html"
})
export class ActionBarItemDropdownComponent extends BaseAngular {
  @Input() model: any

  protected getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action-bar-item-dropdown", ActionBarItemDropdownComponent);