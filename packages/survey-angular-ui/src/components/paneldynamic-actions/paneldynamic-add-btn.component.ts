import { Action, QuestionPanelDynamicModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { Component, Input } from "@angular/core";

@Component({
  selector: "",
  template: ""
})
export class PaneldynamicAction {
  @Input() data: any;
  @Input() model!: Action;
  public get question(): QuestionPanelDynamicModel {
    return (this.model && this.model.data.question) || this.data.question;
  }
}

@Component({
  selector: "sv-ng-paneldynamic-add-btn",
  templateUrl: "./paneldynamic-add-btn.component.html"
})
export class PanelDynamicAddBtn extends PaneldynamicAction {
  addPanelClick() {
    this.question.addPanelUI();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-paneldynamic-add-btn", PanelDynamicAddBtn);