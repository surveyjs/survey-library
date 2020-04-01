import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import {
  ISurveyCreator,
  SurveyQuestion,
  SurveyQuestionAndErrorsCell
} from "./reactquestion";
import {
  MatrixDropdownCell,
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedRow,
  QuestionMatrixDropdownRenderedCell
} from "../question_matrixdropdownbase";
import { Question } from "../question";
import { SurveyQuestionCheckboxItem } from "./reactquestioncheckbox";
import { SurveyQuestionRadioItem } from "./reactquestionradiogroup";

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
  isRendering: boolean = false;
  render(): JSX.Element {
    if (!this.question) return null;
    return this.renderTableDiv();
  }
  renderTableDiv(): JSX.Element {
    this.isRendering = true;
    var header = this.renderHeader();
    var footers = this.renderFooter();
    var rows = this.renderRows();
    var divStyle = this.question.horizontalScroll
      ? ({ overflowX: "scroll" } as React.CSSProperties)
      : ({} as React.CSSProperties);
    this.isRendering = false;
    return (
      <div style={divStyle}>
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
      headers.push(
        <th
          className={this.question.cssClasses.headerCell}
          key={key}
          style={columnStyle}
        >
          {columnTitle}
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
    for (var i = 0; i < cells.length; i++) {
      matrixrow.push(this.renderCell(cells[i], i, cssClasses));
    }
    var key = "row" + keyValue;
    return <tr key={key}>{matrixrow}</tr>;
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
    if (cell.hasTitle) {
      cellContent = this.renderLocString(cell.locTitle);
    }
    if (cell.isRemoveRow) {
      cellContent = this.renderRemoveButton(cell.row);
    }
    return (
      <td className={cssClasses.cell} key={key}>
        {cellContent}
      </td>
    );
  }
  renderRemoveButton(row: MatrixDropdownRowModelBase): JSX.Element {
    return null;
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
    var el: any = this.refs["cell"];
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
        column: this.cell.cell.column
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

    var cellClass = this.cell.question.cssClasses.itemValue;

    if (question.errors.length !== 0)
      cellClass += " " + question.cssClasses.hasError;

    cellClass += " " + question.cssClasses.asCell;

    return cellClass;
  }
  protected getCellStyle(): any {
    if (!this.cell.isChoice) return super.getCellStyle();
    return { textAlign: "center" };
  }

  protected getHeaderText(): string {
    return !!this.cell.locTitle ? this.cell.locTitle.renderedHtml : "";
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
        isDisplayMode={this.cell.question.isDisplayMode}
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
        isDisplayMode={this.cell.question.isDisplayMode}
        item={this.cell.item}
        index={this.cell.choiceIndex.toString()}
        isChecked={this.cell.question.value === this.cell.item.value}
        isDisabled={this.cell.question.isReadOnly || !this.cell.item.isEnabled}
        hideCaption={true}
      />
    );
  }
}
