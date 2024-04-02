import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { QuestionMatrixModel, MatrixRowModel, SurveyModel, ItemValue, Base } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";
import { ReactElementFactory } from "./element-factory";

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
      const style: any = {};
      if (!!this.question.columnMinWidth) {
        style.minWidth = this.question.columnMinWidth;
        style.width = this.question.columnMinWidth;
      }
      headers.push(
        <th className={this.question.cssClasses.headerCell} style={style} key={key}>
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
          <legend className="sv-hidden">{this.question.locTitle.renderedHtml}</legend>
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
  }
  protected getStateElement(): Base | null {
    if(!!this.row) return this.row.item;
    return super.getStateElement();
  }
  private get question(): QuestionMatrixModel {
    return this.props.question;
  }
  private get row(): MatrixRowModel {
    return this.props.row;
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
      const style: any = {};
      if (!!this.question.rowTitleWidth) {
        style.minWidth = this.question.rowTitleWidth;
        style.width = this.question.rowTitleWidth;
      }
      rowsTD = <td style={style} className={this.row.rowTextClasses}>
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

  generateTds(): Array<JSX.Element> {
    const tds:Array<JSX.Element> = [];
    const row = this.row;
    const cellComponent = this.question.cellComponent;
    for (var i = 0; i < this.question.visibleColumns.length; i++) {
      let td: JSX.Element | null = null;
      const column = this.question.visibleColumns[i];
      const key = "value" + i;

      let itemClass = this.question.getItemClass(row, column);
      if (this.question.hasCellText) {
        const getHandler = (column: any) => () => this.cellClick(row, column);
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
        const renderedCell = ReactElementFactory.Instance.createElement(cellComponent, {
          question: this.question,
          row: this.row,
          column: column,
          columnIndex: i,
          cssClasses: this.cssClasses,
          cellChanged: () => { this.cellClick(this.row, column); }
        });
        td = (<td key={key} data-responsive-title={column.locText.renderedHtml} className={this.question.cssClasses.cell}>{renderedCell}</td>);
      }
      tds.push(td);
    }

    return tds;
  }
  cellClick(row: any, column: any): void {
    row.value = column.value;
    this.setState({ value: this.row.value });
  }
}

export class SurveyQuestionMatrixCell extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(event: any): void {
    if(!!this.props.cellChanged) {
      this.props.cellChanged();
    }
  }
  handleOnMouseDown(event: any): void {
    this.question.onMouseDown();
  }
  private get question(): QuestionMatrixModel {
    return this.props.question;
  }
  private get row(): MatrixRowModel {
    return this.props.row;
  }
  private get column(): ItemValue {
    return this.props.column;
  }
  private get columnIndex(): number {
    return this.props.columnIndex;
  }
  protected canRender(): boolean {
    return !!this.question && !!this.row;
  }
  protected renderElement(): JSX.Element {
    const isChecked = this.row.value == this.column.value;
    const inputId = this.question.inputId + "_" + this.row.name + "_" + this.columnIndex;
    const itemClass = this.question.getItemClass(this.row, this.column);
    const mobileSpan = this.question.isMobile ?
      (<span className={this.question.cssClasses.cellResponsiveTitle}>{this.renderLocString(this.column.locText)}</span>)
      : undefined;
    return (<label onMouseDown={this.handleOnMouseDown} className={itemClass}>
      {this.renderInput(inputId, isChecked)}
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
      {mobileSpan}
    </label>);
  }
  protected renderInput(inputId: string, isChecked: boolean): JSX.Element {
    return (<input
      id={inputId}
      type="radio"
      className={this.cssClasses.itemValue}
      name={this.row.fullName}
      value={this.column.value}
      disabled={this.row.isReadOnly}
      checked={isChecked}
      onChange={this.handleOnChange}
      aria-required={this.question.a11y_input_ariaRequired}
      aria-label={this.question.getCellAriaLabel(this.row.locText.renderedHtml, this.column.locText.renderedHtml)}
      aria-invalid={this.question.a11y_input_ariaInvalid}
      aria-errormessage={this.question.a11y_input_ariaErrormessage}
    />);
  }
}

ReactElementFactory.Instance.registerElement("survey-matrix-cell", props => {
  return React.createElement(SurveyQuestionMatrixCell, props);
});

ReactQuestionFactory.Instance.registerQuestion("matrix", props => {
  return React.createElement(SurveyQuestionMatrix, props);
});
