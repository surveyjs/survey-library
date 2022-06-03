import { Component, Input } from "@angular/core";
import { QuestionRadiogroupModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SelectBaseComponent } from "./selectbase.component";

@Component({
  selector: "sv-ng-radiogroup-question",
  templateUrl: "./selectbase.component.html"
})
export class RadiogroupComponent extends SelectBaseComponent<QuestionRadiogroupModel> {
  constructor() {
    super();
    this.inputType = "radio";
    this.showLegend = false;
  }
}

AngularComponentFactory.Instance.registerComponent("radiogroup-question", RadiogroupComponent);