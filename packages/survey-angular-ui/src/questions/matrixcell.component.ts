import { Component, Input } from "@angular/core";
import { MatrixRowModel, ItemValue, QuestionMatrixModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { BaseAngular } from "../base-angular";

export interface INgMatrixCellChanged {
  onCellChanged(row: MatrixRowModel, column: ItemValue): void;
}

@Component({
  selector: "sv-ng-matrix-cell, '[sv-ng-matrix-cell]'",
  templateUrl: "./matrixcell.component.html"
})
export class MatrixCellComponent extends BaseAngular<ItemValue> {
  @Input() question!: QuestionMatrixModel;
  @Input() column!: ItemValue;
  @Input() row!: MatrixRowModel;
  @Input() columnIndex!: number;
  @Input() cellChangedOwner!: INgMatrixCellChanged;
  protected getModel(): ItemValue {
    return this.row.item;
  }
  public onChange(): void {
    this.cellChangedOwner.onCellChanged(this.row, this.column);
  }
}
AngularComponentFactory.Instance.registerComponent("survey-matrix-cell", MatrixCellComponent);