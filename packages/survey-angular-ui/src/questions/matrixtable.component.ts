import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedTable } from "survey-core";

@Component({
  selector: "sv-ng-matrix-table",
  templateUrl: "./matrixtable.component.html",
  // The host is a custom element around the table wrapper. Left as inline, it keeps a line box under the table.
  styles: [":host { display: contents; }"]
})
export class MatrixTableComponent extends BaseAngular<QuestionMatrixDropdownRenderedTable> {
  @Input() question!: QuestionMatrixDropdownModelBase;
  @Input() table!: QuestionMatrixDropdownRenderedTable;
  protected getModel(): QuestionMatrixDropdownRenderedTable {
    return this.table;
  }
  public trackCellBy(_: number, cell: any): string {
    return cell.id;
  }
  public trackRowBy(index: number, row: any): string {
    return row.id;
  }
}
