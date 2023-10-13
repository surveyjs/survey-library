import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";
import {
  MatrixDropdownColumn,
  QuestionMatrixDropdownModelBase,
} from "survey-core";

@Component({
  selector: "sv-ng-matrixheaderrequired",
  styles: [":host { display: none; }"],
  template: "<ng-template #template><ng-container *ngIf='column.isRenderedRequired'><span>&nbsp;</span><span [class]='question.cssClasses.cellRequiredText'>{{ column.requiredText }}</span></ng-container></ng-template>"
})
export class MatrixRequiredHeader extends BaseAngular<MatrixDropdownColumn> {
  @Input() column!: MatrixDropdownColumn;
  @Input() question!: QuestionMatrixDropdownModelBase;
  getModel() {
    return this.column;
  }
}