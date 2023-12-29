import { Component, Input } from "@angular/core";
import { MatrixRowModel, ItemValue, QuestionMatrixModel } from "survey-core";

@Component({
  selector: "sv-ng-matrix-cell, '[sv-ng-matrix-cell]'",
  templateUrl: "./matrixcell.component.html"
})
export class MatrixCellComponent {
  @Input() question!: QuestionMatrixModel;
  @Input() column!: ItemValue;
  @Input() row: MatrixRowModel;
  @Input() columnIndex!: number;
  constructor() {
  }
  public onChange(): void {
    if (this.question.isInputReadOnly) return;
    this.row.value = this.column.value;
  }
}
