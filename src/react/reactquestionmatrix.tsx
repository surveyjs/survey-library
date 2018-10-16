import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { QuestionMatrixModel } from "../question_matrix";
import { MatrixRowModel } from "../question_matrix";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { ItemValue } from "../itemvalue";

export class SurveyQuestionMatrix extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { rowsChanged: 0 };
  }
  protected get question(): QuestionMatrixModel {
    return this.questionBase as QuestionMatrixModel;
  }
  componentDidMount() {
    if (this.question) {
      var self = this;
      this.question.visibleRowsChangedCallback = function() {
        self.setState({ rowsChanged: self.state.rowsChanged + 1 });
      };
    }
  }
  componentWillUnmount() {
    if (this.question) {
      this.question.visibleRowsChangedCallback = null;
    }
  }

  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var firstTH = this.question.hasRows ? <td /> : null;
    var headers = [];
    for (var i = 0; i < this.question.visibleColumns.length; i++) {
      var column = this.question.visibleColumns[i];
      var key = "column" + i;
      var columText = this.renderLocString(column.locText);
      headers.push(<th key={key}>{columText}</th>);
    }
    var rows = [];
    var visibleRows = this.question.visibleRows;
    for (var i = 0; i < visibleRows.length; i++) {
      var row = visibleRows[i];
      var key = "row" + i;
      rows.push(
        <SurveyQuestionMatrixRow
          key={key}
          question={this.question}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
          row={row}
          isFirst={i == 0}
        />
      );
    }
    return (
      <fieldset>
        <table className={cssClasses.root}>
          <thead>
            <tr>
              {firstTH}
              {headers}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <legend style={{ display: "none" }}>
          {this.question.locTitle.renderedHtml}
        </legend>
      </fieldset>
    );
  }
}

export class SurveyQuestionMatrixRow extends ReactSurveyElement {
  private question: QuestionMatrixModel;
  private row: MatrixRowModel;
  private isFirst: boolean;
  constructor(props: any) {
    super(props);
    this.question = props.question;
    this.row = props.row;
    this.isFirst = props.isFirst;
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(event: any) {
    this.row.value = event.target.value;
    this.setState({ value: this.row.value });
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.question = nextProps.question;
    this.row = nextProps.row;
    this.isFirst = nextProps.isFirst;
  }
  render(): JSX.Element {
    if (!this.row) return null;
    var firstTD = null;
    if (this.question.hasRows) {
      var rowText = this.renderLocString(this.row.locText);
      firstTD = <td>{rowText}</td>;
    }
    var tds = this.generateTds();
    return (
      <tr>
        {firstTD}
        {tds}
      </tr>
    );
  }

  generateTds() {
    var tds = [];
    var row = this.row;

    for (var i = 0; i < this.question.visibleColumns.length; i++) {
      var td = null;
      var column = this.question.visibleColumns[i];
      var key = "value" + i;

      var isChecked = row.value == column.value;
      let itemClass = this.getItemClass(row, column);
      var inputId = this.question.inputId + "_" + row.name + "_" + i;

      if (this.question.hasCellText) {
        var getHandler = !this.question.isReadOnly
          ? column => () => this.cellClick(row, column)
          : null;
        td = (
          <td key={key} className={itemClass} onClick={getHandler(column)}>
            {this.renderLocString(
              this.question.getCellDisplayLocText(row.name, column)
            )}
          </td>
        );
      } else {
        td = (
          <td key={key} headers={column.locText.renderedHtml}>
            <label className={itemClass}>
              <input
                id={inputId}
                type="radio"
                className={this.cssClasses.itemValue}
                name={row.fullName}
                value={column.value}
                disabled={this.isDisplayMode}
                checked={isChecked}
                onChange={this.handleOnChange}
                aria-label={this.question.locTitle.renderedHtml}
              />
              <span className="circle" />
              <span className="check" />
              <span style={{ display: "none" }}>
                {this.question.locTitle.renderedHtml}
              </span>
            </label>
            <label
              className={this.question.cssClasses.cellLabel}
              htmlFor={inputId}
            />
          </td>
        );
      }
      tds.push(td);
    }

    return tds;
  }

  getItemClass(row, column) {
    var isChecked = row.value == column.value;
    var cellSelectedClass = this.question.hasCellText
      ? this.cssClasses.cellTextSelected
      : "checked";
    var cellClass = this.question.hasCellText
      ? this.cssClasses.cellText
      : this.cssClasses.label;
    let itemClass = cellClass + (isChecked ? " " + cellSelectedClass : "");
    return itemClass;
  }

  cellClick(row, column) {
    row.value = column.value;
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrix", props => {
  return React.createElement(SurveyQuestionMatrix, props);
});
