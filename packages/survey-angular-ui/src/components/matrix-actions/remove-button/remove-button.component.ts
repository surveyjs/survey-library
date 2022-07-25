import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { Action, Base } from "survey-core";

@Component({
  selector: "sv-ng-matrix-remove-btn",
  templateUrl: "./remove-button.component.html"
})
export class MatrixDynamicRemoveButtonComponent {
  @Input() model!: Action;

  get question() {
    return this.model.data.question;
  }

  get row() {
    return this.model.data.row;
  }

  getModel(): Base {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent(
  "sv-matrix-remove-button",
  MatrixDynamicRemoveButtonComponent
);
