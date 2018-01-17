import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { QuestionMatrixDropdownModel } from "../question_matrixdropdown";
import { ISurveyCreator, SurveyElementErrors } from "./reactquestion";
import { MatrixDropdownRowModel } from "../question_matrixdropdown";
import { MatrixDropdownCell } from "../question_matrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyCustomWidget } from "./custom-widget";

export class SurveyQuestionMatrixDropdown extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionMatrixDropdownModel {
    return this.questionBase as QuestionMatrixDropdownModel;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var headers = [];
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
    var rows = [];
    var visibleRows = this.question.visibleRows;
    for (var i = 0; i < visibleRows.length; i++) {
      var row = visibleRows[i];
      rows.push(
        <SurveyQuestionMatrixDropdownRow
          key={i}
          row={row}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
          creator={this.creator}
        />
      );
    }
    var divStyle = this.question.horizontalScroll
      ? { overflowX: "scroll" }
      : {};
    return (
      <div style={divStyle}>
        <table className={cssClasses.root}>
          <thead>
            <tr>
              <td />
              {headers}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

export class SurveyQuestionMatrixDropdownRow extends ReactSurveyElement {
  private row: MatrixDropdownRowModel;
  protected creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  private setProperties(nextProps: any) {
    this.row = nextProps.row;
    this.creator = nextProps.creator;
  }
  render(): JSX.Element {
    if (!this.row) return null;
    var tds = [];
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
    var rowText = this.renderLocString(this.row.locText);
    return (
      <tr>
        <td>{rowText}</td>
        {tds}
      </tr>
    );
  }
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

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", props => {
  return React.createElement(SurveyQuestionMatrixDropdown, props);
});
