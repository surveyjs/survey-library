import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedCell } from "survey-core";

// The button a sortable column header holds. The cell computes every value; this only renders it.
@Component({
  selector: "sv-ng-matrixheadersortbutton",
  templateUrl: "./matrixheadersortbutton.component.html",
  styleUrls: ["../hide-host.scss"]
})
export class MatrixHeaderSortButtonComponent extends BaseAngular<QuestionMatrixDropdownModelBase> {
  @Input() cell!: QuestionMatrixDropdownRenderedCell;
  @Input() question!: QuestionMatrixDropdownModelBase;
  // The sort, the loading state and the page move live on the question.
  getModel(): QuestionMatrixDropdownModelBase {
    return this.question;
  }
  public onClick(event: MouseEvent): void {
    this.cell.toggleSort(event.shiftKey || event.ctrlKey || event.metaKey);
  }
}
