import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-action-bar-item",
  templateUrl: "./action-bar-item.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ActionBarItemComponent extends BaseAngular {
  @Input() model: any;

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action-bar-item", ActionBarItemComponent);