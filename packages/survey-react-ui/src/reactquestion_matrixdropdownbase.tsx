import * as React from "react";
import {
  ReactSurveyElement,
  SurveyElementBase,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { ISurveyCreator, SurveyQuestion, SurveyQuestionAndErrorsCell, SurveyQuestionErrorCell } from "./reactquestion";
import {
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedRow,
  QuestionMatrixDropdownRenderedCell,
  MatrixDropdownColumn,
  AdaptiveActionContainer,
  Question,
  Base,
} from "survey-core";
import { SurveyQuestionCheckboxItem } from "./reactquestion_checkbox";
import { SurveyQuestionRadioItem } from "./reactquestion_radiogroup";
import { SurveyPanel } from "./panel";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { MatrixRow } from "./components/matrix/row";
import { SurveyQuestionMatrixDynamicDragDropIcon } from "./components/matrix-actions/drag-drop-icon/drag-drop-icon";
import { SurveyQuestionOtherValueItem } from "./reactquestion_comment";
import { ReactElementFactory } from "./element-factory";

class SurveyQuestionMatrixTable extends SurveyElementBase<{ question: QuestionMatrixDropdownModelBase, wrapCell: (cell: QuestionMatrixDropdownRenderedCell, element: JSX.Element, reason: string) => JSX.Element, creator: ISurveyCreator}, any> {
  protected get question() {
    return this.props.question;
  }
  protected get creator() {
    return this.props.creator;
  }
  protected get table() {
    return this.question.renderedTable;
  }
  protected getStateElement() {
    return this.table;
  }
  protected wrapCell(cell: QuestionMatrixDropdownRenderedCell, element: JSX.Element, reason: string): JSX.Element {
    return this.props.wrapCell(cell, element, reason);
  }
  renderHeader(): JSX.Element | null {
    const table = this.question.renderedTable;
    if (!table.showHeader) return null;
    const headers: any[] = [];
    const cells = table.headerRow.cells;
    for (var i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const key = "column" + i;
      const columnStyle: any = {};
      if (!!cell.width) {
        columnStyle.width = cell.width;
      }
      if (!!cell.minWidth) {
        columnStyle.minWidth = cell.minWidth;
      }
      const cellContent = this.renderCellContent(cell, "column-header", {});
      const header = cell.hasTitle ?
        <th className={cell.className} key={key} style={columnStyle}> {cellContent} </th>
        : <td className={cell.className} key={key} style={columnStyle}></td>;
      headers.push(header);
    }
    return (
      <thead>
        <tr>{headers}</tr>
      </thead>
    );
  }
  renderFooter(): JSX.Element | null {
    const table = this.question.renderedTable;
    if (!table.showFooter) return null;
    const row = this.renderRow(
      "footer",
      table.footerRow,
      this.question.cssClasses,
      "row-footer"
    );
    return <tfoot>{row}</tfoot>;
  }
  renderRows(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const rows:Array<JSX.Element> = [];
    const renderedRows = this.question.renderedTable.renderedRows;
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
    cssClasses: any,
    reason?: string
  ): JSX.Element {
    const matrixrow:Array<JSX.Element> = [];
    const cells = row.cells;

    for (var i = 0; i < cells.length; i++) {
      matrixrow.push(this.renderCell(cells[i], i, cssClasses, reason));
    }
    const key = "row" + keyValue;

    return (
      <React.Fragment key={key}>
        {(reason == "row-footer") ? <tr>{matrixrow}</tr> : <MatrixRow model={row} parentMatrix={this.question}>{matrixrow}</MatrixRow>}
      </React.Fragment>
    );
  }

  renderCell(
    cell: QuestionMatrixDropdownRenderedCell,
    index: number,
    cssClasses: any,
    reason?: string
  ): JSX.Element {
    const key = "cell" + index;
    if (cell.hasQuestion) {
      return (
        <SurveyQuestionMatrixDropdownCell
          key={key}
          cssClasses={cssClasses}
          cell={cell}
          creator={this.creator}
          reason={reason}
        />
      );
    }
    if (cell.isErrorsCell) {
      if(cell.isErrorsCell) {
        return (
          <SurveyQuestionMatrixDropdownErrorsCell
            cell={cell}
            key={key}
            keyValue={key}
            question={cell.question}
            creator={this.creator}
          >
          </SurveyQuestionMatrixDropdownErrorsCell>
        );
      }
    }
    let calcReason = reason;
    if(!calcReason) {
      calcReason = cell.hasTitle ? "row-header" : "";
    }
    const cellContent = this.renderCellContent(cell, calcReason, cssClasses);
    let cellStyle: any = null;
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
        title={cell.getTitle()}
      >
        {cellContent}
      </td>
    );
  }
  private renderCellContent(
    cell: QuestionMatrixDropdownRenderedCell,
    reason: string,
    cssClasses: any
  ): JSX.Element | null {
    let cellContent: JSX.Element | null = null;
    let cellStyle: any = null;
    if (!!cell.width || !!cell.minWidth) {
      cellStyle = {};
      if (!!cell.width) cellStyle.width = cell.width;
      if (!!cell.minWidth) cellStyle.minWidth = cell.minWidth;
    }
    if (cell.hasTitle) {
      reason = "row-header";
      const str = this.renderLocString(cell.locTitle);
      const require = !!cell.column ? <SurveyQuestionMatrixHeaderRequired column={cell.column} question={this.question}/> : null;
      cellContent = (<>{str}{require}</>);
    }
    if (cell.isDragHandlerCell) {
      cellContent = (<>
        <SurveyQuestionMatrixDynamicDragDropIcon item={{ data: { row: cell.row, question: this.question } }}/>
      </>);
    }
    if (cell.isActionsCell) {
      cellContent = (
        ReactElementFactory.Instance.createElement("sv-matrixdynamic-actions-cell", {
          question: this.question, cssClasses, cell, model: cell.item.getData()
        })
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
      </>
    );
    return this.wrapCell(cell, readyCell, reason);
  }
  protected renderElement(): JSX.Element | null {
    const header = this.renderHeader();
    const footers = this.renderFooter();
    const rows = this.renderRows();
    return (
      <table className={this.question.getTableCss()}>
        {header}
        {rows}
        {footers}
      </table>
    );
  }
}

export class SurveyQuestionMatrixDropdownBase extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    //Create rendered table in contructor and not on rendering
    const table = this.question.renderedTable;
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
  componentDidMount(): void {
    super.componentDidMount();
    this.question.onRenderedTableResetCallback = () => {
      this.updateStateOnCallback();
    };
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.question.onRenderedTableResetCallback = () => {};
  }
  protected renderElement(): JSX.Element {
    return this.renderTableDiv();
  }
  renderTableDiv(): JSX.Element {
    var divStyle = this.question.showHorizontalScroll
      ? ({ overflowX: "scroll" } as React.CSSProperties)
      : ({} as React.CSSProperties);
    return (
      <div style={divStyle} className={this.question.cssClasses.tableWrapper} ref={(root) => (this.setControl(root))}>
        <SurveyQuestionMatrixTable question={this.question} creator={this.creator} wrapCell={(cell, element, reason) => this.wrapCell(cell, element, reason)}></SurveyQuestionMatrixTable>
      </div>
    );
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

class SurveyQuestionMatrixDropdownErrorsCell extends SurveyQuestionErrorCell {
  constructor(props: any) {
    super(props);
  }
  protected get key() {
    return this.props.keyValue;
  }
  protected get cell() {
    return this.props.cell;
  }
  public render(): JSX.Element | null {
    if(!this.cell.isVisible) return null;
    return <td
      className={this.cell.className}
      key={this.key}
      colSpan={this.cell.colSpans}
      title={this.cell.getTitle()}
    >
      {super.render()}
    </td>;
  }
  protected getQuestionPropertiesToTrack(): string[] {
    return super.getQuestionPropertiesToTrack().concat(["visible"]);
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrixdynamic-actions-cell",
  (props) => {
    return React.createElement(SurveyQuestionMatrixActionsCell, props);
  }
);
class SurveyQuestionMatrixHeaderRequired extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  get column(): MatrixDropdownColumn {
    return this.props.column;
  }
  get question(): Question {
    return this.props.question;
  }
  protected getStateElement(): Base {
    return this.column;
  }
  protected renderElement(): JSX.Element | null {
    if(!this.column.isRenderedRequired) return null;
    return (
      <>
        <span>&nbsp;</span>
        <span className={this.question.cssClasses.cellRequiredText}>{this.column.requiredText}</span>
      </>
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
  protected get itemCss(): string {
    return !!this.cell ? this.cell.className : "";
  }
  protected getQuestion(): Question | any {
    var q = super.getQuestion();
    if (!!q) return q;
    return !!this.cell ? this.cell.question : null;
  }
  protected doAfterRender(): void {
    var el = this.cellRef.current;
    if (
      el &&
      this.cell &&
      this.question &&
      this.question.survey &&
      el.getAttribute("data-rendered") !== "r"
    ) {
      el.setAttribute("data-rendered", "r");
      const options = {
        cell: this.cell,
        cellQuestion: this.question,
        htmlElement: el,
        row: this.cell.row,
        column: this.cell.cell.column,
      };
      this.question.survey.matrixAfterCellRender(this.question, options);
      this.question.afterRenderCore(el);
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
  protected renderElement(): JSX.Element | null {
    if(!this.cell.isVisible) {
      return null;
    }
    return super.renderElement();
  }
  protected renderCellContent() {
    const content = super.renderCellContent();
    const responsiveTitle = this.cell.showResponsiveTitle ? (<span className={this.cell.responsiveTitleCss}>{this.renderLocString(this.cell.responsiveLocTitle)}</span>) : null;
    return <>
      {responsiveTitle}
      {content}
    </>;
  }
  protected renderQuestion(): JSX.Element {
    if(!this.question.isVisible) return <></>;
    if (!this.cell.isChoice)
      return SurveyQuestion.renderQuestionBody(this.creator, this.question);
    if (this.cell.isOtherChoice) return this.renderOtherComment();
    if (this.cell.isCheckbox) return this.renderCellCheckboxButton();
    return this.renderCellRadiogroupButton();
  }
  private renderOtherComment(): JSX.Element {
    const question = this.cell.question;
    const cssClasses = question.cssClasses || {};
    return <SurveyQuestionOtherValueItem question={question} cssClasses={cssClasses} otherCss={cssClasses.other} isDisplayMode={question.isInputReadOnly} />;
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