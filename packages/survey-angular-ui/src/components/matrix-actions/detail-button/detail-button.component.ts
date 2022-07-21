import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { Action } from "survey-core";
import { Base } from "survey-core";

@Component({
  selector: "sv-ng-matrix-detail-btn",
  templateUrl: "./detail-button.component.html"
})
export class MatrixDetailButtonComponent {
  @Input() public model!: Action;

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

AngularComponentFactory.Instance.registerComponent("sv-matrix-detail-button", MatrixDetailButtonComponent);
