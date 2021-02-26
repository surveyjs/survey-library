import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { QuestionMatrixModel } from "../question_matrix";
import { MatrixRowModel } from "../question_matrix";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { Helpers } from "../helpers";

export class SurveyQuestionMatrix extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { rowsChanged: 0 };
  }
  protected get question(): QuestionMatrixModel {
    return this.questionBase as QuestionMatrixModel;
  }
  componentDidMount() {
    super.componentDidMount();
    if (this.question) {
      var self = this;
      this.question.visibleRowsChangedCallback = function () {
        self.setState({ rowsChanged: self.state.rowsChanged + 1 });
      };
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.question) {
      this.question.visibleRowsChangedCallback = null;
    }
  }

  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var firstTH = this.question.hasRows ? <td /> : null;
    var headers = [];
    for (var i = 0; i < this.question.visibleColumns.length; i++) {
      var column = this.question.visibleColumns[i];
      var key = "column" + i;
      var columText = this.renderLocString(column.locText);
      headers.push(
        <th className={this.question.cssClasses.headerCell} key={key}>
          {columText}
        </th>
      );
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
    var header = !this.question.showHeader ? null : (
      <thead>
        <tr>
          {firstTH}
          {headers}
        </tr>
      </thead>
    );
    return (
      <div className={cssClasses.tableWrapper} ref={(root) => (this.control = root)}>
        <fieldset>
          <legend aria-label={this.question.locTitle.renderedHtml} />
          <table className={cssClasses.root}>
            {header}
            <tbody>{rows}</tbody>
          </table>
        </fieldset>
      </div>
    );
  }
}

export class SurveyQuestionMatrixRow extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  private get question(): QuestionMatrixModel {
    return this.props.question;
  }
  private get row(): MatrixRowModel {
    return this.props.row;
  }
  handleOnChange(event: any) {
    this.row.value = event.target.value;
    this.setState({ value: this.row.value });
  }
  protected canRender(): boolean {
    return !!this.row;
  }
  protected renderElement(): JSX.Element {    
    var rowsTD = null;
    if (this.question.hasRows) {
      var rowText = this.renderLocString(this.row.locText);
      rowsTD = <td className={this.question.cssClasses.cell}>{rowText}</td>;
    }
    var tds = this.generateTds();
    return (
      <tr className={this.row.rowClasses}>
        {this.generateDragDropTD()}
        {rowsTD}
        {tds}
      </tr>
    );
  }

  generateDragDropTD() {
    if (!this.question.allowRowsDragAndDrop)return null;

    return <td className={this.question.cssClasses.cell}>
      <svg
        width="10"
        height="16"
        viewBox="0 0 10 16"
        className={
          this.cssClasses.itemIcon +
          " " +
          this.cssClasses.itemIconHoverMod
        }
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 2C6 0.9 6.9 0 8 0C9.1 0 10 0.9 10 2C10 3.1 9.1 4 8 4C6.9 4 6 3.1 6 2ZM2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" />
      </svg>
    </td>;
  }

  generateTds() {
    var tds = [];
    var row = this.row;

    for (var i = 0; i < this.question.visibleColumns.length; i++) {
      var td = null;
      var column = this.question.visibleColumns[i];
      var key = "value" + i;

      //var isChecked = Helpers.isTwoValueEquals(row.value, column.value);
      var isChecked = row.value == column.value;
      let itemClass = this.question.getItemClass(row, column);
      var inputId = this.question.inputId + "_" + row.name + "_" + i;
      if (this.question.hasCellText) {
        var getHandler = !this.question.isReadOnly
          ? (column: any) => () => this.cellClick(row, column)
          : null;
        td = (
          <td
            key={key}
            className={itemClass}
            onClick={getHandler ? getHandler(column) : null}
          >
            {this.renderLocString(
              this.question.getCellDisplayLocText(row.name, column)
            )}
          </td>
        );
      } else {
        td = (
          <td
            key={key}
            headers={column.locText.renderedHtml}
            className={this.question.cssClasses.cell}
          >
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
                aria-required={this.question.isRequired}
                aria-label={this.question.locTitle.renderedHtml}
              />
              <span className={this.question.cssClasses.materialDecorator}>
                <svg
                  className={this.question.cssClasses.itemDecorator}
                  viewBox="-12 -12 24 24"
                >
                  <circle r="6" cx="0" cy="0" />s
                </svg>
              </span>
              <span className="circle" />
              <span className="check" />
              <span style={{ display: "none" }}>
                {this.question.locTitle.renderedHtml}
              </span>
            </label>
          </td>
        );
      }
      tds.push(td);
    }

    return tds;
  }
  cellClick(row: any, column: any) {
    row.value = column.value;
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrix", (props) => {
  return React.createElement(SurveyQuestionMatrix, props);
});
