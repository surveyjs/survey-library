import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { QuestionMatrixModel, MatrixRowModel, SurveyModel, Helpers } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";

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
      this.question.visibleRowsChangedCallback = null as any;
    }
  }

  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var rowsTH = this.question.hasRows ? <td /> : null;
    var headers:Array<JSX.Element> = [];
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
    var rows:Array<JSX.Element> = [];
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
        ref={root => (this.setControl(root))}
      >
        <fieldset>
          <legend aria-label={this.question.locTitle.renderedHtml} />
          <table className={this.question.getTableCss()}>
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
    const survey: SurveyModel = this.question.survey as SurveyModel;
    let wrapper: JSX.Element | null = null;
    if (survey) {
      wrapper = ReactSurveyElementsWrapper.wrapMatrixCell(survey, element, cell, reason);
    }
    return wrapper ?? element;
  }
  protected canRender(): boolean {
    return !!this.row;
  }
  protected renderElement(): JSX.Element {
    var rowsTD: JSX.Element | null = null;

    if (this.question.hasRows) {
      var rowText = this.renderLocString(this.row.locText);
      rowsTD = <td className={this.question.cssClasses.rowTextCell}>
        {this.wrapCell({ row: this.row }, rowText, "row-header")}
      </td>;
    }

    var tds = this.generateTds();
    return (
      <tr className={this.row.rowClasses || undefined}>
        {rowsTD}
        {tds}
      </tr>
    );
  }

  generateTds() {
    var tds:Array<JSX.Element> = [];
    var row = this.row;

    for (var i = 0; i < this.question.visibleColumns.length; i++) {
      var td: JSX.Element | null = null;
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
            onClick={getHandler ? getHandler(column) : () => {}}
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
                {this.question.itemSvgIcon ?
                  <svg
                    className={this.cssClasses.itemDecorator}
                  >
                    <use xlinkHref={this.question.itemSvgIcon}></use>
                  </svg> :
                  null
                }
              </span>
              <span style={!this.question.isMobile ? { display: "none" } : undefined } className={this.question.cssClasses.cellResponsiveTitle}>
                {this.renderLocString(column.locText)}
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
