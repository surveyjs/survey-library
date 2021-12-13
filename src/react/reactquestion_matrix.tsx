import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { QuestionMatrixModel } from "survey-core";
import { MatrixRowModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { Helpers } from "survey-core";
import { ReactSurveyModel } from "./reactsurveymodel";

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
      this.question.visibleRowsChangedCallback = function() {
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
    var rowsTH = this.question.hasRows ? <td /> : null;
    var headers = [];
    for (var i = 0; i < this.question.visibleColumns.length; i++) {
      var column = this.question.visibleColumns[i];
      var key = "column" + i;
      var columText = this.renderLocString(column.locText);
      headers.push(
        <th className={this.question.cssClasses.headerCell} key={key}>
          {this.wrapCell({ column: column }, columText, "column-header")}
        </th>
      );
    }
    var rows = [];
    var visibleRows = this.question.visibleRows;
    for (var i = 0; i < visibleRows.length; i++) {
      var row = visibleRows[i];
      var key = "row-" + row.name + "-" + i;
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
          {rowsTH}
          {headers}
        </tr>
      </thead>
    );
    return (
      <div
        className={cssClasses.tableWrapper}
        ref={root => (this.control = root)}
      >
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
  protected wrapCell(cell: any, element: JSX.Element, reason: string): JSX.Element {
    if(!reason) {
      return element;
    }
    const survey: ReactSurveyModel = this.question.survey as ReactSurveyModel;
    let wrapper: JSX.Element;
    if (survey) {
      wrapper = survey.wrapMatrixCell(element, cell, reason);
    }
    return wrapper ?? element;
  }
  protected canRender(): boolean {
    return !!this.row;
  }
  protected renderElement(): JSX.Element {
    var rowsTD = null;

    if (this.question.hasRows) {
      var rowText = this.renderLocString(this.row.locText);
      rowsTD = <td className={this.question.cssClasses.cell}>
        {this.wrapCell({ row: this.row }, rowText, "row-header")}
      </td>;
    }

    var tds = this.generateTds();
    return (
      <tr className={this.row.rowClasses}>
        {rowsTD}
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

      //var isChecked = Helpers.isTwoValueEquals(row.value, column.value);
      var isChecked = row.value == column.value;
      let itemClass = this.question.getItemClass(row, column);
      var inputId = this.question.inputId + "_" + row.name + "_" + i;
      if (this.question.hasCellText) {
        var getHandler = !this.question.isInputReadOnly
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
            data-responsive-title={column.locText.renderedHtml}
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
                aria-required={this.question.ariaRequired}
                aria-label={column.locText.renderedHtml}
                aria-invalid={this.question.ariaInvalid}
                aria-describedby={this.question.ariaDescribedBy}
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
    this.setState({ value: this.row.value });
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrix", props => {
  return React.createElement(SurveyQuestionMatrix, props);
});
