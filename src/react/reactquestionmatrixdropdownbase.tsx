import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { ISurveyCreator, SurveyElementErrors } from "./reactquestion";
import {
  MatrixDropdownCell,
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
  MatrixDropdownColumn
} from "../question_matrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyCustomWidget } from "./custom-widget";

export class SurveyQuestionMatrixDropdownBase extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionMatrixDropdownModelBase {
    return this.questionBase as QuestionMatrixDropdownModelBase;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    return this.renderTableDiv();
  }
  renderTableDiv(): JSX.Element {
    var header = this.question.isColumnsLocationHorizontal
      ? this.renderHeader()
      : this.renderRowsAsHeaders();
    var rows = this.question.isColumnsLocationHorizontal
      ? this.renderRows()
      : this.renderColumnsAsRows();
    var divStyle = this.question.horizontalScroll
      ? { overflowX: "scroll" }
      : {};
    return (
      <div style={divStyle}>
        <table className={this.question.cssClasses.root}>
          {header}
          {rows}
        </table>
      </div>
    );
  }
  renderHeader(): JSX.Element {
    if (!this.question.showHeader) return null;
    var headers = [];
    this.addHeaderLeft(headers);
    for (var i = 0; i < this.question.columns.length; i++) {
      var column = this.question.columns[i];
      var key = "column" + i;
      var minWidth = this.question.getColumnWidth(column);
      var columnStyle = minWidth ? { minWidth: minWidth } : {};
      var columnTitle = this.renderLocString(column.locTitle);
      headers.push(
        <th key={key} style={columnStyle}>
          {columnTitle}
        </th>
      );
    }
    this.addHeaderRight(headers);
    return (
      <thead>
        <tr>{headers}</tr>
      </thead>
    );
  }
  renderRowsAsHeaders(): JSX.Element {
    return null;
  }
  renderColumnsAsRows(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var rows = [];
    var columns = this.question.columns;
    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];
      rows.push(this.renderColumnAsRow(i, column, cssClasses));
    }
    this.addBottomColumnAsRows(rows);
    return <tbody>{rows}</tbody>;
  }

  renderRows(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var rows = [];
    var visibleRows = this.question.visibleRows;
    for (var i = 0; i < visibleRows.length; i++) {
      var row = visibleRows[i];
      rows.push(this.renderRow(i, row, cssClasses));
    }
    return <tbody>{rows}</tbody>;
  }
  renderRow(
    index: number,
    row: MatrixDropdownRowModelBase,
    cssClasses: any
  ): JSX.Element {
    return null;
  }
  renderColumnAsRow(
    index: number,
    column: MatrixDropdownColumn,
    cssClasses: any
  ): JSX.Element {
    var tds = [];
    if (this.question.showHeader) {
      var colTitle = this.renderLocString(column.locTitle);
      tds.push(<td>{colTitle}</td>);
    }
    var rows = this.question.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      var cell = rows[i].cells[index];
      var cellElement = (
        <SurveyQuestionMatrixDropdownCell
          key={"cell" + i}
          cssClasses={cssClasses}
          cell={cell}
          creator={this.creator}
        />
      );
      tds.push(cellElement);
    }
    return <tr key={"row" + index}>{tds}</tr>;
  }
  protected addHeaderLeft(elements: Array<JSX.Element>) {}
  protected addHeaderRight(elements: Array<JSX.Element>) {}
  protected addBottomColumnAsRows(elements: Array<JSX.Element>) {}
}

export class SurveyQuestionMatrixDropdownRowBase extends ReactSurveyElement {
  protected row: MatrixDropdownRowModelBase;
  protected creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  protected setProperties(nextProps: any) {
    this.row = nextProps.row;
    this.creator = nextProps.creator;
  }
  render(): JSX.Element {
    if (!this.row) return null;
    var tds = [];
    this.AddLeftCells(tds);
    for (var i = 0; i < this.row.cells.length; i++) {
      var cell = this.row.cells[i];
      var cellElement = (
        <SurveyQuestionMatrixDropdownCell
          key={"row" + i}
          cssClasses={this.cssClasses}
          cell={cell}
          creator={this.creator}
        />
      );
      tds.push(cellElement);
    }
    this.AddRightCells(tds);
    return <tr>{tds}</tr>;
  }
  protected AddLeftCells(tds: Array<JSX.Element>) {}
  protected AddRightCells(tds: Array<JSX.Element>) {}
}

export class SurveyQuestionMatrixDropdownCell extends ReactSurveyElement {
  private cell: MatrixDropdownCell;
  protected creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
    if (this.cell && this.cell.question) {
      var q = this.cell.question;
      this.state = { isReadOnly: q.isReadOnly, visible: q.visible };
    }
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  private setProperties(nextProps: any) {
    this.cell = nextProps.cell;
    this.creator = nextProps.creator;
  }
  componentDidMount() {
    this.doAfterRender();
    if (this.cell && this.cell.question) {
      var self = this;
      this.cell.question.registerFunctionOnPropertyValueChanged(
        "isReadOnly",
        function() {
          self.setState({ isReadOnly: self.cell.question.isReadOnly });
        },
        "react"
      );
      this.cell.question.registerFunctionOnPropertyValueChanged(
        "visible",
        function() {
          self.setState({ visible: self.cell.question.visible });
        },
        "react"
      );
    }
  }
  componentWillUnmount() {
    if (this.cell && this.cell.question) {
      this.cell.question.unRegisterFunctionOnPropertiesValueChanged(
        ["visible", "isReadOnly"],
        "react"
      );
      var el: any = this.refs["cell"];
      if (!!el) {
        el.removeAttribute("data-rendered");
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    this.doAfterRender();
  }
  private doAfterRender() {
    var el: any = this.refs["cell"];
    if (
      el &&
      this.cell &&
      this.cell.question.survey &&
      el.getAttribute("data-rendered") !== "r"
    ) {
      el.setAttribute("data-rendered", "r");
      var options = {
        cell: this.cell,
        cellQuestion: this.cell.question,
        htmlElement: el,
        row: this.cell.row,
        column: this.cell.column
      };
      this.cell.question.survey.matrixAfterCellRender(
        this.cell.question,
        options
      );
    }
  }
  render(): JSX.Element {
    if (!this.cell) return null;
    var errors = (
      <SurveyElementErrors
        element={this.cell.question}
        cssClasses={this.cssClasses}
        creator={this.creator}
      />
    );
    var renderedCell = this.renderCell();
    return (
      <td ref="cell" className={this.cssClasses.itemValue}>
        {errors}
        {renderedCell}
      </td>
    );
  }
  renderCell(): JSX.Element {
    if (!this.cell.question.visible) return null;
    var customWidget = this.cell.question.customWidget;
    if (!customWidget) {
      return this.creator.createQuestionElement(this.cell.question);
    }
    return (
      <SurveyCustomWidget
        creator={this.creator}
        question={this.cell.question}
      />
    );
  }
}
