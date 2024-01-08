import { Component, Input } from "@angular/core";
import { MatrixRowModel, ItemValue, QuestionMatrixModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

export interface INgMatrixCellChanged {
  onCellChanged(row: MatrixRowModel, column: ItemValue): void;
}

@Component({
  selector: "sv-ng-matrix-cell, '[sv-ng-matrix-cell]'",
  templateUrl: "./matrixcell.component.html"
})
export class MatrixCellComponent {
  @Input() question!: QuestionMatrixModel;
  @Input() column!: ItemValue;
  @Input() row!: MatrixRowModel;
  @Input() columnIndex!: number;
  @Input() cellChangedOwner!: INgMatrixCellChanged;
  constructor() {
  }
  public onChange(): void {
    this.cellChangedOwner.onCellChanged(this.row, this.column);
  }
  public get isReadOnly(): boolean {
    return this.question.isInputReadOnly || this.row.isReadOnly;
  }
}
AngularComponentFactory.Instance.registerComponent("survey-matrix-cell", MatrixCellComponent);