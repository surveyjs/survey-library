import { Component } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { PaneldynamicAction } from "./paneldynamic-add-btn.component";

@Component({
  selector: "sv-ng-paneldynamic-remove-btn",
  templateUrl: "./paneldynamic-remove-btn.component.html"
})
export class PaneldynamicRemoveButtonComponent extends PaneldynamicAction {
  get panel() {
    return (this.data ? this.data : this.model.data).panel;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-paneldynamic-remove-btn", PaneldynamicRemoveButtonComponent);
