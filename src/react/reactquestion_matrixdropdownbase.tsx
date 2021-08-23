import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestion_element";
import { SurveyQuestion, SurveyQuestionAndErrorsCell } from "./reactquestion";
import {
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedRow,
  QuestionMatrixDropdownRenderedCell,
  AdaptiveActionContainer,
  Question
} from "survey-core";
import { SurveyQuestionCheckboxItem } from "./reactquestion_checkbox";
import { SurveyQuestionRadioItem } from "./reactquestion_radiogroup";
import { SurveyPanel } from "./panel";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { MatrixRow } from "./components/matrix/row";
import { SurveyQuestionMatrixDynamicDragDropIcon } from "./components/matrix-actions/drag-drop-icon/drag-drop-icon";

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
  private updateStateOnCallback() {
    if (this.isRendering) return;
    this.setState(this.getState(this.state));
  }
  componentDidMount() {
    super.componentDidMount();
    this.question.visibleRowsChangedCallback = () => {
      this.updateStateOnCallback();
    };
    this.question.onRenderedTableResetCallback = () => {
      this.updateStateOnCallback();
    };
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.question.visibleRowsChangedCallback = undefined;
    this.question.onRenderedTableResetCallback = undefined;
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
      var cellContent = this.renderCellContent(cell, "column-header", {});
      headers.push(
        <th
          className={this.question.cssClasses.headerCell}
          key={key}
          style={columnStyle}
        >
          {cellContent}
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

    return (
      <React.Fragment key={key}>
        <MatrixRow model={row}>{matrixrow}</MatrixRow>
      </React.Fragment>
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
          itemCss={cell.className}
          cssClasses={cssClasses}
          cell={cell}
          creator={this.creator}
        />
      );
    }
    let reason = cell.hasTitle ? "row-header" : "";
    var cellContent = this.renderCellContent(cell, reason, cssClasses);
    var cellStyle: any = null;
    if (!!cell.width || !!cell.minWidth) {
      cellStyle = {};
      if (!!cell.width) cellStyle.width = cell.width;
      if (!!cell.minWidth) cellStyle.minWidth = cell.minWidth;
    }

    return (
      <td
        className={cell.className}
        key={key}
        style={cellStyle}
        colSpan={cell.colSpans}
      >
        {cellContent}
      </td>
    );
  }
  private renderCellContent(
    cell: QuestionMatrixDropdownRenderedCell,
    reason: string,
    cssClasses: any
  ): JSX.Element {
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
      reason = "row-header";
      cellContent = this.renderLocString(cell.locTitle);
      if (cell.requiredText) {
        requiredSpace = <span>&nbsp;</span>;
        requiredText = <span>{cell.requiredText}</span>;
      }
    }
    if (cell.isDragHandlerCell) {
      cellContent = (<>
        <SurveyQuestionMatrixDynamicDragDropIcon item={{ data: { row: cell.row, question: this.question } }}/>
      </>);
    }
    if (cell.isActionsCell) {
      cellContent = (
        <SurveyQuestionMatrixActionsCell
          model={cell.item.getData()}
        ></SurveyQuestionMatrixActionsCell>
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
    if (!cellContent) return null;

    const readyCell = (
      <>
        {cellContent}
        {requiredSpace}
        {requiredText}
      </>
    );
    return this.wrapCell(cell, readyCell, reason);
  }
}

class SurveyQuestionMatrixActionsCell extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  get model(): AdaptiveActionContainer {
    return this.props.model;
  }
  protected renderElement(): JSX.Element {
    return (
      <SurveyActionBar model={this.model} handleClick={false}></SurveyActionBar>
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
  protected getCellStyle(): any {
    var res: any = super.getCellStyle();
    if (!!this.cell.width || !!this.cell.minWidth) {
      if (!res) res = {};
      if (!!this.cell.width) res.width = this.cell.width;
      if (!!this.cell.minWidth) res.minWidth = this.cell.minWidth;
    }

    return res;
  }

  protected getHeaderText(): string {
    return this.cell.headers;
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
        isDisplayMode={this.cell.question.isInputReadOnly}
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
        isDisplayMode={this.cell.question.isInputReadOnly}
        item={this.cell.item}
        index={this.cell.choiceIndex.toString()}
        isChecked={this.cell.question.value === this.cell.item.value}
        isDisabled={this.cell.question.isReadOnly || !this.cell.item.isEnabled}
        hideCaption={true}
      />
    );
  }
}
