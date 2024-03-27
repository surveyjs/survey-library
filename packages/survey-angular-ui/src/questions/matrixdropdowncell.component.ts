import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../base-angular";
import {
  Question,
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedCell,
  MatrixDropdownRowModelBase,
  SurveyModel
} from "survey-core";
import { getComponentName } from "../question";

@Component({
  selector: "sv-ng-matrixdropdown-cell",
  templateUrl: "./matrixdropdowncell.component.html",
  styles: [":host { display: none; }"]
})
export class MatrixDropdownCellComponent extends BaseAngular<Question> {
  @Input() question!: QuestionMatrixDropdownModelBase;
  @Input() cell!: QuestionMatrixDropdownRenderedCell;

  @ViewChild("cellContainer") cellContainer!: ElementRef<HTMLElement>;
  getModel() {
    if(this.cell.hasQuestion) {
      return this.cell.question;
    }
    if(!!this.cell.column) {
      return this.cell.column;
    }
    return null as any;
  }
  public get row(): MatrixDropdownRowModelBase {
    return this.cell.row;
  }
  public override ngDoCheck(): void {
    super.ngDoCheck();
    if(this.cell.isErrorsCell && this.cell?.question) {
      this.cell.question.registerFunctionOnPropertyValueChanged("errors", () => {
        this.update();
      }, "__ngSubscription")
    }
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

  getComponentName(element: Question) { return getComponentName(element); }
  getHeaders(): string {
    return this.cell.headers;
  }
  getCellStyle() {
    if (!!this.cell.width || !!this.cell.minWidth)
      return { width: this.cell.width, minWidth: this.cell.minWidth };
    return null;
  }
  public get isRequiredCell(): boolean {
    return !!this.cell.column && this.cell.column.isRenderedRequired;
  }
  ngAfterViewInit() {
    if (!this.cell.hasQuestion || !this.question || !this.question.survey) return;
    const el = this.cellContainer.nativeElement;
    const cellQ = this.cell.question;
    var options = {
      cell: this.cell.cell,
      cellQuestion: cellQ,
      htmlElement: el,
      row: this.cell.row,
      column: this.cell.cell.column,
    };
    this.question.survey.matrixAfterCellRender(this.question, options);
    cellQ.afterRenderCore(el);
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if(this.cell.isErrorsCell && this.cell?.question) {
      this.cell.question.unRegisterFunctionOnPropertyValueChanged("errors", "__ngSubscription")    
    }
  }
  public get canRender() {
    return this.question && this.question.survey;
  }
}