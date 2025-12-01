import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { IAction, MatrixDropdownRowModelBase } from "survey-core";
import { EmbeddedViewContentComponent } from "../../../embedded-view-content.component";

@Component({
  templateUrl: "drag-drop-icon.component.html",
  selector: "sv-ng-matrix-drag-drop-icon",
  styleUrls: ["../../../hide-host.scss"]
})
export class MatrixDynamicDragDropIconComponent extends EmbeddedViewContentComponent {
  @Input() public model!: IAction;

  get question() {
    return this.model.data.question;
  }

  get row(): MatrixDropdownRowModelBase {
    return this.model.data.row;
  }
}

AngularComponentFactory.Instance.registerComponent(
  "sv-matrix-drag-drop-icon",
  MatrixDynamicDragDropIconComponent
);
