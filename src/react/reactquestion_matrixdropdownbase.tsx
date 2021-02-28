import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { SurveyQuestion, SurveyQuestionAndErrorsCell } from "./reactquestion";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedRow,
  QuestionMatrixDropdownRenderedCell,
} from "survey-core";
import { Question } from "survey-core";
import { SurveyQuestionCheckboxItem } from "./reactquestion_checkbox";
import { SurveyQuestionRadioItem } from "./reactquestion_radiogroup";
import { SurveyPanel } from "./panel";

export class SurveyQuestionMatrixDropdownBase extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = this.getState();
  }
  protected get question(): QuestionMatrixDropdownModelBase {
    return this.questionBase as QuestionMatrixDropdownModelBase;
  }
  private getState(prevState: any = null) {
    return { rowCounter: !prevState ? 0 : prevState.rowCounter + 1 };
  }
  private updateVisibleRowsChangedCallback() {
    this.question.visibleRowsChangedCallback = () => {
      this.updateStateOnCallback();
    };
  }
  private renderedTableResetCallback() {
    this.question.onRenderedTableResetCallback = () => {
      this.updateStateOnCallback();
    };
  }
  private updateStateOnCallback() {
    if (this.isRendering) return;
    this.setState(this.getState(this.state));
  }
  componentDidMount() {
    super.componentDidMount();
    this.updateVisibleRowsChangedCallback();
    this.renderedTableResetCallback();
  }
  protected renderElement(): JSX.Element {
    return this.renderTableDiv();
  }
  renderTableDiv(): JSX.Element {
    var header = this.renderHeader();
    var footers = this.renderFooter();
    var rows = this.renderRows();
    var divStyle = this.question.horizontalScroll
      ? ({ overflowX: "scroll" } as React.CSSProperties)
      : ({} as React.CSSProperties);
    return (
      <div style={divStyle} ref={(root) => (this.control = root)}>
        <table className={this.question.cssClasses.root}>
          {header}
          {rows}
          {footers}
        </table>
      </div>
    );
  }
  renderHeader(): JSX.Element {
    var table = this.question.renderedTable;
    if (!table.showHeader) return null;
    var headers: any[] = [];
    var cells = table.headerRow.cells;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var key = "column" + i;
      var columnStyle: any = {};
      if (!!cell.width) {
        columnStyle.width = cell.width;
      }
      if (!!cell.minWidth) {
        columnStyle.minWidth = cell.minWidth;
      }
      var columnTitle = this.renderLocString(cell.locTitle);
      var requiredSpace = !!cell.requiredText ? <span>&nbsp;</span> : null;
      var requiredText = !!cell.requiredText ? (
        <span>{cell.requiredText}</span>
      ) : null;
      headers.push(
        <th
          className={this.question.cssClasses.headerCell}
          key={key}
          style={columnStyle}
        >
          {columnTitle}
          {requiredSpace}
          {requiredText}
        </th>
      );
    }
    return (
      <thead>
        <tr>{headers}</tr>
      </thead>
    );
  }
  renderFooter(): JSX.Element {
    var table = this.question.renderedTable;
    if (!table.showFooter) return null;
    var row = this.renderRow(
      "footer",
      table.footerRow,
      this.question.cssClasses
    );
    return <tfoot>{row}</tfoot>;
  }
  renderRows(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var rows = [];
    var renderedRows = this.question.renderedTable.rows;
    for (var i = 0; i < renderedRows.length; i++) {
      rows.push(
        this.renderRow(renderedRows[i].id, renderedRows[i], cssClasses)
      );
    }
    return <tbody>{rows}</tbody>;
  }
  renderRow(
    keyValue: any,
    row: QuestionMatrixDropdownRenderedRow,
    cssClasses: any
  ): JSX.Element {
    var matrixrow = [];
    var cells = row.cells;

    matrixrow.push(this.generateDragDropTD(cssClasses));

    for (var i = 0; i < cells.length; i++) {
      matrixrow.push(this.renderCell(cells[i], i, cssClasses));
    }
    var key = "row" + keyValue;
    return (
      <tr className={row.className} key={key}>
        {matrixrow}
      </tr>
    );
  }
  generateDragDropTD(cssClasses: any) {
    if (!this.question.allowRowsDragAndDrop) return null;

    return (
      <td key={this.question.name + "-td-d&d"} className={cssClasses.cell}>
        <svg
          width="10"
          height="16"
          viewBox="0 0 10 16"
          className={cssClasses.itemIcon + " " + cssClasses.itemIconHoverMod}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 2C6 0.9 6.9 0 8 0C9.1 0 10 0.9 10 2C10 3.1 9.1 4 8 4C6.9 4 6 3.1 6 2ZM2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" />
        </svg>
      </td>
    );
  }

  renderCell(
    cell: QuestionMatrixDropdownRenderedCell,
    index: number,
    cssClasses: any
  ): JSX.Element {
    var key = "cell" + index;
    if (cell.hasQuestion) {
      return (
        <SurveyQuestionMatrixDropdownCell
          key={key}
          cssClasses={cssClasses}
          cell={cell}
          creator={this.creator}
        />
      );
    }
    var cellContent = null;
    var requiredSpace = null;
    var requiredText = null;
    var cellStyle: any = null;
    if (!!cell.width || !!cell.minWidth) {
      cellStyle = {};
      if (!!cell.width) cellStyle.width = cell.width;
      if (!!cell.minWidth) cellStyle.minWidth = cell.minWidth;
    }
    if (cell.hasTitle) {
      cellContent = this.renderLocString(cell.locTitle);
      if (cell.requiredText) {
        requiredSpace = <span>&nbsp;</span>;
        requiredText = <span>{cell.requiredText}</span>;
      }
    }
    if (cell.isRemoveRow) {
      cellContent = this.renderRemoveButton(cell.row);
    }
    if (cell.isShowHideDetail) {
      cellContent = (
        <SurveyQuestionMatrixDetailButton
          question={this.question}
          row={cell.row}
          cssClasses={cssClasses}
        />
      );
    }
    if (cell.hasPanel) {
      cellContent = (
        <SurveyPanel
          key={cell.panel.id}
          element={cell.panel}
          survey={this.question.survey}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
          creator={this.creator}
        />
      );
    }
    return (
      <td
        className={cell.className}
        key={key}
        style={cellStyle}
        colSpan={cell.colSpans}
      >
        {cellContent}
        {requiredSpace}
        {requiredText}
      </td>
    );
  }
  renderRemoveButton(row: MatrixDropdownRowModelBase): JSX.Element {
    return null;
  }
}

export class SurveyQuestionMatrixDetailButton extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnShowHideClick = this.handleOnShowHideClick.bind(this);
  }
  private get question(): QuestionMatrixDropdownModelBase {
    return this.props.question;
  }
  private get row(): MatrixDropdownRowModelBase {
    return this.props.row;
  }
  handleOnShowHideClick(event: any) {
    this.row.showHideDetailPanelClick();
  }
  protected renderElement(): JSX.Element {
    var isExpanded = this.row.isDetailPanelShowing;
    var ariaExpanded = isExpanded;
    var ariaControls = isExpanded ? this.row.detailPanelId : null;
    return (
      <button
        type="button"
        onClick={this.handleOnShowHideClick}
        className={this.question.getDetailPanelButtonCss(this.row)}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
      >
        <span className={this.question.getDetailPanelIconCss(this.row)} />
      </button>
    );
  }
}

export class SurveyQuestionMatrixDropdownCell extends SurveyQuestionAndErrorsCell {
  constructor(props: any) {
    super(props);
  }
  private get cell(): QuestionMatrixDropdownRenderedCell {
    return this.props.cell;
  }
  protected getQuestion(): Question {
    var q = super.getQuestion();
    if (!!q) return q;
    return !!this.cell ? this.cell.question : null;
  }
  protected doAfterRender() {
    var el = this.cellRef.current;
    if (
      el &&
      this.cell &&
      this.question &&
      this.question.survey &&
      el.getAttribute("data-rendered") !== "r"
    ) {
      el.setAttribute("data-rendered", "r");
      var options = {
        cell: this.cell,
        cellQuestion: this.question,
        htmlElement: el,
        row: this.cell.row,
        column: this.cell.cell.column,
      };
      this.question.survey.matrixAfterCellRender(this.question, options);
    }
  }
  protected getShowErrors(): boolean {
    return (
      this.question.isVisible &&
      (!this.cell.isChoice || this.cell.isFirstChoice)
    );
  }
  protected getCellClass(): any {
    var question = this.cell.question;
    var cellClass = this.cell.className;
    if (question.errors.length !== 0)
      cellClass += " " + question.cssClasses.hasError;
    return cellClass;
  }
  protected getCellStyle(): any {
    if (!this.cell.isChoice) {
      var res: any = super.getCellStyle();
      if (!!this.cell.width || !!this.cell.minWidth) {
        if (!res) res = {};
        if (!!this.cell.width) res.width = this.cell.width;
        if (!!this.cell.minWidth) res.minWidth = this.cell.minWidth;
      }

      return res;
    }
    return { textAlign: "center" };
  }

  protected getHeaderText(): string {
    var column = this.cell.cell && this.cell.cell.column;
    return !!(column && column.locTitle) ? column.locTitle.renderedHtml : "";
  }
  protected renderQuestion(): JSX.Element {
    if (!this.cell.isChoice)
      return SurveyQuestion.renderQuestionBody(this.creator, this.question);
    if (this.cell.isCheckbox) return this.renderCellCheckboxButton();
    return this.renderCellRadiogroupButton();
  }
  private renderCellCheckboxButton(): JSX.Element {
    var key = this.cell.question.id + "item" + this.cell.choiceIndex;
    return (
      <SurveyQuestionCheckboxItem
        key={key}
        question={this.cell.question}
        cssClasses={this.cell.question.cssClasses}
        isDisplayMode={this.cell.question.isReadOnly}
        item={this.cell.item}
        isFirst={this.cell.isFirstChoice}
        index={this.cell.choiceIndex.toString()}
        hideCaption={true}
      />
    );
  }
  private renderCellRadiogroupButton(): JSX.Element {
    var key = this.cell.question.id + "item" + this.cell.choiceIndex;
    return (
      <SurveyQuestionRadioItem
        key={key}
        question={this.cell.question}
        cssClasses={this.cell.question.cssClasses}
        isDisplayMode={this.cell.question.isReadOnly}
        item={this.cell.item}
        index={this.cell.choiceIndex.toString()}
        isChecked={this.cell.question.value === this.cell.item.value}
        isDisabled={this.cell.question.isReadOnly || !this.cell.item.isEnabled}
        hideCaption={true}
      />
    );
  }
}
