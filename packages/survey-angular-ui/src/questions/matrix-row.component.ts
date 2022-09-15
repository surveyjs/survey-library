import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../base-angular";
import {
  MatrixDropdownRowModelBase,
  Question,
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedCell,
  QuestionMatrixDropdownRenderedRow
} from "survey-core";

@Component({
  selector: "sv-ng-matrix-row",
  templateUrl: "./matrix-row.component.html",
  styles: [":host { display: none; }"]
})
export class MatrixRowComponent extends BaseAngular<QuestionMatrixDropdownRenderedRow> {
  @Input() model!: QuestionMatrixDropdownRenderedRow;
  @Input() question!: QuestionMatrixDropdownModelBase;
  protected getModel(): QuestionMatrixDropdownRenderedRow {
    return this.model;
  }
  public get row(): MatrixDropdownRowModelBase {
    return this.model.row;
  }
  public trackCellBy(_: number, cell: any): string {
    return cell.id;
  }
}