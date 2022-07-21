import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { Action } from "survey-core";
import { Base } from "survey-core";

@Component({
  template: "<span [class]='question.cssClasses.iconDrag'></span>",
  selector: "sv-ng-drag-drop-icon"
})
export class MatrixDynamicDragDropIconComponent {
  @Input() public model!: Action;

  get question() {
    return this.model.data.question;
  }

  getModel(): Base {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent(
  "sv-matrix-drag-drop-icon",
  MatrixDynamicDragDropIconComponent
);
