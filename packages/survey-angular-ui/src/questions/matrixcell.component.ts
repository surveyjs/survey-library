import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../base-angular";
import {
  Question,
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedCell,
  MatrixDropdownRowModelBase,
  SurveyModel
} from "survey-core";

@Component({
  selector: "sv-ng-matrix-cell",
  templateUrl: "./matrixcell.component.html",
  styles: [":host { display: none; }"]
  })
export class MatrixCellComponent extends BaseAngular<Question> {
  @Input() question!: QuestionMatrixDropdownModelBase;
  @Input() cell!: QuestionMatrixDropdownRenderedCell;

  @ViewChild("cellContainer") cellContainer!: ElementRef<HTMLElement>;

  isVisible: boolean = false;

  getModel() {
    return this.cell.question;
  }
  public get row(): MatrixDropdownRowModelBase {
    return this.cell.row;
  }
  public get panelComponentName(): string {
    const panel = this.cell.panel;
    const survey = <SurveyModel>panel.survey;
    if(!!survey) {
      const name = survey.getElementWrapperComponentName(panel);
      if(!!name) {
        return name;
      }
    }
    return "panel";
  }
  public get panelComponentData(): any {
    const panel = this.cell.panel;
    const survey = <SurveyModel>panel.survey;
    let data: any;
    if(!!survey) {
      data = survey.getElementWrapperComponentData(panel);
    }
    return {
      componentName: "panel",
      componentData: {
        model: panel,
        data: data
      }
    };
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