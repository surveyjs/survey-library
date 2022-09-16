import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../base-angular";
import {
  Question,
  QuestionMatrixDropdownRenderedCell
} from "survey-core";

@Component({
  selector: "sv-ng-matrix-cell",
  templateUrl: "./matrixcell.component.html",
  styles: [":host { display: none; }"]
})
export class MatrixCellComponent extends BaseAngular<Question> {
  @Input() question!: Question;
  @Input() cell!: QuestionMatrixDropdownRenderedCell;

  @ViewChild("cellContainer") cellContainer!: ElementRef<HTMLElement>;

  isVisible: boolean = false;

  getModel() {
    return this.cell.question;
  }
  public get row() {
    return this.cell.row;
  }

  getComponentName(element: Question) {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return element.getType()+"-question";
  }
  getHeaders(): string {
    return this.cell.headers;
  }
  getCellStyle() {
    if (!!this.cell.width || !!this.cell.minWidth)
      return { width: this.cell.width, minWidth: this.cell.minWidth };
    return null;
  }
  ngAfterViewInit() {
    if (!this.cell.hasQuestion || !this.question || !this.question.survey) return;
    var options = {
      cell: this.cell.cell,
      cellQuestion: this.cell.question,
      htmlElement: this.cellContainer.nativeElement,
      row: this.cell.row,
      column: this.cell.cell.column,
    };
    this.question.survey.matrixAfterCellRender(this.question, options);
  }
}