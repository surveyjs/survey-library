import { Component } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { PaneldynamicAction } from "./paneldynamic-add-btn.component";

@Component({
  selector: "sv-ng-paneldynamic-progress-text",
  templateUrl: "./paneldynamic-progress-text.component.html"
})
export class PanelDynamicProgressText extends PaneldynamicAction {
}

AngularComponentFactory.Instance.registerComponent("sv-paneldynamic-progress-text", PanelDynamicProgressText);