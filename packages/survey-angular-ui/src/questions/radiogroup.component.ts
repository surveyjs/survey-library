import { Component } from "@angular/core";
import { QuestionRadiogroupModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SelectBaseComponent } from "./selectbase.component";

@Component({
  selector: "sv-ng-radiogroup-question",
  templateUrl: "./selectbase.component.html"
})
export class RadiogroupComponent extends SelectBaseComponent<QuestionRadiogroupModel> {
  override ngOnInit(): void {
    this.inputType = "radio";
    this.showLegend = false;
    super.ngOnInit();
  }
}

AngularComponentFactory.Instance.registerComponent("radiogroup-question", RadiogroupComponent);