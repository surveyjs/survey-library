import { Component } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { PaneldynamicAction } from "./paneldynamic-add-btn.component";

@Component({
  selector: "sv-ng-paneldynamic-prev-btn",
  templateUrl: "./paneldynamic-prev-btn.component.html"
})
export class PanelDynamicPrevBtn extends PaneldynamicAction {
  prevPanelClick() {
    this.question.goToPrevPanel();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-paneldynamic-prev-btn", PanelDynamicPrevBtn);