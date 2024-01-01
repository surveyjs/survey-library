import { Component, Input } from "@angular/core";
import { MatrixRowModel, ItemValue, QuestionMatrixModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-matrix-cell, '[sv-ng-matrix-cell]'",
  templateUrl: "./matrixcell.component.html"
})
export class MatrixCellComponent {
  @Input() question!: QuestionMatrixModel;
  @Input() column!: ItemValue;
  @Input() row!: MatrixRowModel;
  @Input() columnIndex!: number;
  @Input("cellChange") cellChanged!: (row: MatrixRowModel, column: ItemValue) => void;
  constructor() {
  }
  public onChange(): void {
    this.cellChanged(this.row, this.column);
  }
}
AngularComponentFactory.Instance.registerComponent("survey-matrix-cell", MatrixCellComponent);