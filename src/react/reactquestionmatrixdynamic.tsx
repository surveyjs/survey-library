import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { ISurveyCreator } from "./reactquestion";
import { MatrixDynamicRowModel } from "../question_matrixdynamic";
import { MatrixDropdownCell } from "../question_matrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyCustomWidget } from "./custom-widget";
import { SurveyQuestionMatrixDropdownCell } from "./reactquestionmatrixdropdown";

export class SurveyQuestionMatrixDynamic extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.setProperties(props);
    this.state = this.getState();
  }
  protected get question(): QuestionMatrixDynamicModel {
    return this.questionBase as QuestionMatrixDynamicModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  private setProperties(nextProps: any) {
    if (this.refs.matrixDynamicRef) this.setState({ rowCounter: 0 });
    this.question.rowCountChangedCallback = () => {
      this.setState(this.getState(this.state));
    };
    this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
  }
  private getState(prevState = null) {
    return { rowCounter: !prevState ? 0 : prevState.rowCounter + 1 };
  }
  handleOnRowAddClick(event) {
    this.question.addRow();
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
        <SurveyQuestionMatrixDynamicRow
          key={row.id}
          row={row}
          question={this.question}
          index={i}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
          creator={this.creator}
        />
      );
    }
    var divStyle = this.question.horizontalScroll
      ? { overflowX: "scroll" }
      : {};
    var btnDeleteTD = !this.isDisplayMode ? <td /> : null;
    return (
      <div ref="matrixDynamicRef">
        <div style={divStyle}>
          <table className={cssClasses.root}>
            <thead>
              <tr>
                {headers}
                {btnDeleteTD}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
        <div className={cssClasses.footer}>
          {this.renderAddRowButton(cssClasses)}
        </div>
      </div>
    );
  }
  protected renderAddRowButton(cssClasses: any): JSX.Element {
    if (this.isDisplayMode || !this.question.canAddRow) return null;
    return (
      <input
        className={cssClasses.button}
        type="button"
        onClick={this.handleOnRowAddClick}
        value={this.question.addRowText}
      />
    );
  }
}

export class SurveyQuestionMatrixDynamicRow extends ReactSurveyElement {
  private row: MatrixDynamicRowModel;
  private question: QuestionMatrixDynamicModel;
  private index: number;
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
    this.question = nextProps.question;
    this.index = nextProps.index;
    this.creator = nextProps.creator;
    this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
  }
  handleOnRowRemoveClick(event) {
    this.question.removeRowUI(this.index);
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
    if (!this.isDisplayMode && this.question.canRemoveRow) {
      var removeButton = this.renderButton();
      tds.push(<td key={"row" + this.row.cells.length + 1}>{removeButton}</td>);
    }
    return <tr>{tds}</tr>;
  }
  protected renderButton(): JSX.Element {
    return (
      <input
        className={this.cssClasses.button}
        type="button"
        onClick={this.handleOnRowRemoveClick}
        value={this.question.removeRowText}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", props => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});
