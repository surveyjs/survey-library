import { Component } from "@angular/core";
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
export default PanelDynamicNextBtn;
