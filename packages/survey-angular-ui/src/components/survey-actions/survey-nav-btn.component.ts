import { Action } from "survey-core";
import { Base } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { Component, Input } from "@angular/core";

@Component({
  templateUrl: "./survey-nav-btn.component.html",
  selector: "sv-ng-nav-btn",
  styles: [":host { display: contents; }"]
})
export class SurveyNavigationButton {
  @Input() public model!: Action;
  getModel(): Action {
    return this.model;
  }
  buttonMouseDown(): Base {
    return this.model.data && this.model.data.mouseDown();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-nav-btn", SurveyNavigationButton);
