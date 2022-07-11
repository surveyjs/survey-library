import { Component } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { PaneldynamicAction } from "./paneldynamic-add-btn.component";

@Component({
  selector: "sv-ng-paneldynamic-next-btn",
  templateUrl: "./paneldynamic-next-btn.component.html"
})
export class PanelDynamicNextBtn extends PaneldynamicAction {
  nextPanelClick() {
    this.question.goToNextPanel();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-paneldynamic-next-btn", PanelDynamicNextBtn);
