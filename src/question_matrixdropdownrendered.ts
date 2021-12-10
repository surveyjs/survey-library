import { property } from "./jsonobject";
import { Question } from "./question";
import { Base } from "./base";
import { ItemValue } from "./itemvalue";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";
import { PanelModel } from "./panel";
import { Action, IAction } from "./actions/action";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { MatrixDropdownColumn } from "./question_matrixdropdowncolumn";
import { MatrixDropdownCell, MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "./question_matrixdropdownbase";
import { ActionContainer } from "./actions/container";
import { QuestionMatrixDynamicModel } from "./question_matrixdynamic";

export class QuestionMatrixDropdownRenderedCell {
  private static counter = 1;
  private idValue: number;
  private itemValue: ItemValue;
  public minWidth: string = "";
  public width: string = "";
  public locTitle: LocalizableString;
  public cell: MatrixDropdownCell;
  public column: MatrixDropdownColumn;
  public row: MatrixDropdownRowModelBase;
  public question: Question;
  public isRemoveRow: boolean;
  public choiceIndex: number;
  public matrix: QuestionMatrixDropdownModelBase;
  public requiredText: string;
  public isEmpty: boolean;
  public colSpans: number = 1;
  public panel: PanelModel;
  public isShowHideDetail: boolean;
  public isActionsCell: boolean = false;
  public isDragHandlerCell: boolean = false;
  private classNameValue: string = "";
  public constructor() {
    this.idValue = QuestionMatrixDropdownRenderedCell.counter++;
  }
  public get hasQuestion(): boolean {
    return !!this.question;
  }
  public get hasTitle(): boolean {
    return !!this.locTitle;
  }
  public get hasPanel(): boolean {
    return !!this.panel;
  }
  public get id(): number {
    return this.idValue;
  }
  public get showErrorOnTop(): boolean {
    return this.showErrorOnCore("top");
  }
  public get showErrorOnBottom(): boolean {
    return this.showErrorOnCore("bottom");
  }
  private showErrorOnCore(location: string): boolean {
    return (
      this.getShowErrorLocation() == location &&
      (!this.isChoice || this.isFirstChoice)
    );
  }
  private getShowErrorLocation(): string {
    return this.hasQuestion ? this.question.survey.questionErrorLocation : "";
  }
  public get item(): ItemValue {
    return this.itemValue;
  }
  public set item(val: ItemValue) {
    this.itemValue = val;
    if (!!val) {
      val.hideCaption = true;
    }
  }
  public get isChoice(): boolean {
    return !!this.item;
  }
  public get choiceValue(): any {
    return this.isChoice ? this.item.value : null;
  }
  public get isCheckbox(): boolean {
    return this.isChoice && this.question.getType() == "checkbox";
  }
  public get isFirstChoice(): boolean {
    return this.choiceIndex === 0;
  }
  public set className(val: string) {
    this.classNameValue = val;
  }
  public get className(): string {
    const builder = new CssClassBuilder().append(this.classNameValue);
    if (this.hasQuestion) {
      builder
        .append(this.question.cssClasses.hasError, this.question.errors.length > 0)
        .append(this.question.cssClasses.answered, this.question.isAnswered);
    }
    return builder.toString();
  }
  public get headers(): string {
    if (
      this.cell &&
      this.cell.column &&
      this.cell.column.isShowInMultipleColumns
    ) {
      return this.item.locText.renderedHtml;
    }
    if (this.question && this.question.isVisible) {
      return this.question.locTitle.renderedHtml;
    }
    if (this.hasTitle) {
      return this.locTitle.renderedHtml || "";
    }
    return "";
  }
  getTitle(): string {
    return (this.matrix && this.matrix.showColumnHeader) ? this.headers : "";
  }

  public calculateFinalClassName(matrixCssClasses: any): string {
    const questionCss = this.cell.question.cssClasses;
    // 'text-align': $data.isChoice ? 'center':
    const builder = new CssClassBuilder()
      .append(questionCss.itemValue, !!questionCss)
      .append(questionCss.asCell, !!questionCss);
    return builder.append(matrixCssClasses.cell, builder.isEmpty() && !!matrixCssClasses)
      .append(matrixCssClasses.choiceCell, this.isChoice)
      .toString();
  }
}

export class QuestionMatrixDropdownRenderedRow extends Base {
  @property({ defaultValue: null }) ghostPosition: string;
  @property({ defaultValue: false }) isAdditionalClasses: boolean;

  public row: MatrixDropdownRowModelBase;
  private static counter = 1;
  private idValue: number;
  public cells: Array<QuestionMatrixDropdownRenderedCell> = [];

  public constructor(public cssClasses: any, public isDetailRow: boolean = false) {
    super();
    this.onCreating();
    this.idValue = QuestionMatrixDropdownRenderedRow.counter++;
  }
  public onCreating() { } // need for knockout binding see QuestionMatrixDropdownRenderedRow.prototype["onCreating"]
  public get id(): number {
    return this.idValue;
  }
  public get attributes() {
    if (!this.row) return {};
    return { "data-sv-drop-target-matrix-row": this.row.id };
  }
  public get className(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.row)
      .append(this.cssClasses.detailRow, this.isDetailRow)
      .append(this.cssClasses.dragDropGhostPositionTop, this.ghostPosition === "top")
      .append(this.cssClasses.dragDropGhostPositionBottom, this.ghostPosition === "bottom")
      .append(this.cssClasses.rowAdditional, this.isAdditionalClasses)
      .toString();
  }
}

export class QuestionMatrixDropdownRenderedTable extends Base {
  private headerRowValue: QuestionMatrixDropdownRenderedRow;
  private footerRowValue: QuestionMatrixDropdownRenderedRow;
  private hasRemoveRowsValue: boolean;
  private rowsActions: Array<Array<IAction>>;
  private cssClasses: any;
  public constructor(public matrix: QuestionMatrixDropdownModelBase) {
    super();
    this.createNewArray("rows");
    this.build();
  }
  public get showTable(): boolean {
    return this.getPropertyValue("showTable", true);
  }
  public get showHeader(): boolean {
    return this.getPropertyValue("showHeader");
  }
  public get showAddRowOnTop(): boolean {
    return this.getPropertyValue("showAddRowOnTop", false);
  }
  public get showAddRowOnBottom(): boolean {
    return this.getPropertyValue("showAddRowOnBottom", false);
  }
  public get showFooter(): boolean {
    return this.matrix.hasFooter && this.matrix.isColumnLayoutHorizontal;
  }
  public get hasFooter(): boolean {
    return !!this.footerRow;
  }
  public get hasRemoveRows(): boolean {
    return this.hasRemoveRowsValue;
  }
  public isRequireReset(): boolean {
    return (
      this.hasRemoveRows != this.matrix.canRemoveRows ||
      !this.matrix.isColumnLayoutHorizontal
    );
  }
  public get headerRow(): QuestionMatrixDropdownRenderedRow {
    return this.headerRowValue;
  }
  public get footerRow(): QuestionMatrixDropdownRenderedRow {
    return this.footerRowValue;
  }
  public get rows(): Array<QuestionMatrixDropdownRenderedRow> {
    return this.getPropertyValue("rows");
  }
  protected build() {
    this.hasRemoveRowsValue = this.matrix.canRemoveRows;
    //build rows now
    var rows = this.matrix.visibleRows;
    this.cssClasses = this.matrix.cssClasses;
    this.buildRowsActions();
    this.buildHeader();
    this.buildRows();
    this.buildFooter();
    this.updateShowTableAndAddRow();
  }
  public updateShowTableAndAddRow() {
    var showTable =
      this.rows.length > 0 ||
      this.matrix.isDesignMode ||
      !this.matrix.getShowColumnsIfEmpty();
    this.setPropertyValue("showTable", showTable);
    var showAddRow = this.matrix.canAddRow && showTable;
    var showAddRowOnTop = showAddRow;
    var showAddRowOnBottom = showAddRow;
    if (showAddRowOnTop) {
      if (this.matrix.getAddRowLocation() === "default") {
        showAddRowOnTop = this.matrix.columnLayout === "vertical";
      } else {
        showAddRowOnTop = this.matrix.getAddRowLocation() !== "bottom";
      }
    }
    if (showAddRowOnBottom && this.matrix.getAddRowLocation() !== "topBottom") {
      showAddRowOnBottom = !showAddRowOnTop;
    }
    this.setPropertyValue("showAddRowOnTop", showAddRowOnTop);
    this.setPropertyValue("showAddRowOnBottom", showAddRowOnBottom);
  }
  public onAddedRow() {
    if (this.getRenderedDataRowCount() >= this.matrix.visibleRows.length)
      return;
    var row = this.matrix.visibleRows[this.matrix.visibleRows.length - 1];
    this.rowsActions.push(this.buildRowActions(row));
    this.addHorizontalRow(
      this.rows,
      row,
      this.matrix.visibleRows.length == 1 && !this.matrix.showHeader
    );
    this.updateShowTableAndAddRow();
  }
  private getRenderedDataRowCount(): number {
    var res = 0;
    for (var i = 0; i < this.rows.length; i++) {
      if (!this.rows[i].isDetailRow) res++;
    }
    return res;
  }
  public onRemovedRow(row: MatrixDropdownRowModelBase) {
    var rowIndex = this.getRenderedRowIndex(row);
    if (rowIndex < 0) return;
    this.rowsActions.splice(rowIndex, 1);
    var removeCount = 1;
    if (
      rowIndex < this.rows.length - 1 &&
      this.rows[rowIndex + 1].isDetailRow
    ) {
      removeCount++;
    }
    this.rows.splice(rowIndex, removeCount);
    this.updateShowTableAndAddRow();
  }
  public onDetailPanelChangeVisibility(
    row: MatrixDropdownRowModelBase,
    isShowing: boolean
  ) {
    var rowIndex = this.getRenderedRowIndex(row);
    if (rowIndex < 0) return;
    var panelRowIndex =
      rowIndex < this.rows.length - 1 && this.rows[rowIndex + 1].isDetailRow
        ? rowIndex + 1
        : -1;
    if ((isShowing && panelRowIndex > -1) || (!isShowing && panelRowIndex < 0))
      return;
    if (isShowing) {
      var detailRow = this.createDetailPanelRow(row, this.rows[rowIndex]);
      this.rows.splice(rowIndex + 1, 0, detailRow);
    } else {
      this.rows.splice(panelRowIndex, 1);
    }
  }
  private getRenderedRowIndex(row: MatrixDropdownRowModelBase): number {
    for (var i = 0; i < this.rows.length; i++) {
      if (this.rows[i].row == row) return i;
    }
    return -1;
  }
  protected buildRowsActions() {
    this.rowsActions = [];
    var rows = this.matrix.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      this.rowsActions.push(this.buildRowActions(rows[i]));
    }
  }
  protected buildHeader() {
    var colHeaders =
      this.matrix.isColumnLayoutHorizontal && this.matrix.showHeader;
    var isShown =
      colHeaders ||
      (this.matrix.hasRowText && !this.matrix.isColumnLayoutHorizontal);
    this.setPropertyValue("showHeader", isShown);
    if (!isShown) return;
    this.headerRowValue = new QuestionMatrixDropdownRenderedRow(
      this.cssClasses
    );
    if (this.matrix.allowRowsDragAndDrop) {
      this.headerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.hasActionCellInRows("start")) {
      this.headerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.matrix.hasRowText && this.matrix.showHeader) {
      this.headerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.matrix.isColumnLayoutHorizontal) {
      for (var i = 0; i < this.matrix.visibleColumns.length; i++) {
        var column = this.matrix.visibleColumns[i];
        if (!column.hasVisibleCell) continue;
        if (column.isShowInMultipleColumns) {
          this.createMutlipleColumnsHeader(column);
        } else {
          this.headerRow.cells.push(this.createHeaderCell(column));
        }
      }
    } else {
      var rows = this.matrix.visibleRows;
      for (var i = 0; i < rows.length; i++) {
        const cell = this.createTextCell(rows[i].locText);
        cell.row = rows[i];
        this.headerRow.cells.push(cell);
      }
      if (this.matrix.hasFooter) {
        this.headerRow.cells.push(
          this.createTextCell(this.matrix.getFooterText())
        );
      }
    }
    if (this.hasActionCellInRows("end")) {
      this.headerRow.cells.push(this.createHeaderCell(null));
    }
  }
  protected buildFooter() {
    if (!this.showFooter) return;
    this.footerRowValue = new QuestionMatrixDropdownRenderedRow(
      this.cssClasses
    );
    if (this.matrix.allowRowsDragAndDrop) {
      this.footerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.hasActionCellInRows("start")) {
      this.footerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.matrix.hasRowText) {
      this.footerRow.cells.push(
        this.createTextCell(this.matrix.getFooterText())
      );
    }
    var cells = this.matrix.visibleTotalRow.cells;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (!cell.column.hasVisibleCell) continue;
      if (cell.column.isShowInMultipleColumns) {
        this.createMutlipleColumnsFooter(this.footerRow, cell);
      } else {
        var editCell = this.createEditCell(cell);
        if (cell.column) {
          this.setHeaderCellWidth(cell.column, editCell);
        }
        this.footerRow.cells.push(editCell);
      }
    }
    if (this.hasActionCellInRows("end")) {
      this.footerRow.cells.push(this.createHeaderCell(null));
    }
  }
  protected buildRows() {
    var rows = this.matrix.isColumnLayoutHorizontal
      ? this.buildHorizontalRows()
      : this.buildVerticalRows();
    this.setPropertyValue("rows", rows);
  }
  private hasActionCellInRowsValues: any = {};
  private hasActionCellInRows(location: "start" | "end"): boolean {
    if (this.hasActionCellInRowsValues[location] === undefined) {
      var rows = this.matrix.visibleRows;
      this.hasActionCellInRowsValues[location] = false;
      for (var i = 0; i < rows.length; i++) {
        if (!this.isValueEmpty(this.getRowActions(i, location))) {
          this.hasActionCellInRowsValues[location] = true;
          break;
        }
      }
    }
    return this.hasActionCellInRowsValues[location];
  }
  private canRemoveRow(row: MatrixDropdownRowModelBase): boolean {
    return this.matrix.canRemoveRow(row);
  }
  private buildHorizontalRows(): Array<QuestionMatrixDropdownRenderedRow> {
    var rows = this.matrix.visibleRows;
    var renderedRows: Array<QuestionMatrixDropdownRenderedRow> = [];
    for (var i = 0; i < rows.length; i++) {
      this.addHorizontalRow(
        renderedRows,
        rows[i],
        i == 0 && !this.matrix.showHeader
      );
    }
    return renderedRows;
  }
  private addHorizontalRow(
    renderedRows: Array<QuestionMatrixDropdownRenderedRow>,
    row: MatrixDropdownRowModelBase,
    useAsHeader: boolean
  ) {
    var renderedRow = this.createHorizontalRow(row, useAsHeader);
    renderedRow.row = row;
    renderedRows.push(renderedRow);
    if (row.isDetailPanelShowing) {
      renderedRows.push(this.createDetailPanelRow(row, renderedRow));
    }
  }
  private getRowDragCell(rowIndex: number) {
    const cell = new QuestionMatrixDropdownRenderedCell();
    cell.isDragHandlerCell = true;
    cell.className = this.cssClasses.actionsCell;
    cell.row = this.matrix.visibleRows[rowIndex];
    return cell;
  }
  private getRowActionsCell(rowIndex: number, location: "start" | "end") {
    const rowActions = this.getRowActions(rowIndex, location);
    if (!this.isValueEmpty(rowActions)) {
      const cell = new QuestionMatrixDropdownRenderedCell();
      const actionContainer = this.matrix.allowAdaptiveActions ? new AdaptiveActionContainer() : new ActionContainer();
      actionContainer.setItems(rowActions);

      const itemValue = new ItemValue(actionContainer);
      cell.item = itemValue;
      cell.isActionsCell = true;
      cell.className = this.cssClasses.actionsCell;
      cell.row = this.matrix.visibleRows[rowIndex];
      return cell;
    }
    return null;
  }
  private getRowActions(rowIndex: number, location: "start" | "end") {
    var actions = this.rowsActions[rowIndex];
    if (!Array.isArray(actions)) return [];
    return actions.filter((action) => {
      if (!action.location) {
        action.location = "start";
      }
      return action.location === location;
    });
  }
  private buildRowActions(row: MatrixDropdownRowModelBase): Array<IAction> {
    var actions: Array<IAction> = [];
    this.setDefaultRowActions(row, actions);
    if (!!this.matrix.survey) {
      actions = this.matrix.survey.getUpdatedMatrixRowActions(
        this.matrix,
        row,
        actions
      );
    }
    return actions;
  }
  private get showRemoveButtonAsIcon() {
    return (
      this.matrix.survey && (<any>this.matrix.survey).css.root === "sd-root-modern"
    );
  }
  protected setDefaultRowActions(
    row: MatrixDropdownRowModelBase,
    actions: Array<IAction>
  ) {
    const matrix = <QuestionMatrixDynamicModel>this.matrix;
    if (this.hasRemoveRows && this.canRemoveRow(row)) {
      if (!this.showRemoveButtonAsIcon) {
        actions.push(
          new Action({
            id: "remove-row",
            location: "end",
            enabled: !this.matrix.isInputReadOnly,
            component: "sv-matrix-remove-button",
            data: { row: row, question: this.matrix },
          })
        );
      } else {
        actions.push(
          new Action({
            id: "remove-row",
            iconName: "icon-delete",
            component: "sv-action-bar-item",
            innerCss: new CssClassBuilder().append(this.matrix.cssClasses.button).append(this.matrix.cssClasses.buttonRemove).toString(),
            location: "end",
            showTitle: false,
            title: matrix.removeRowText,
            enabled: !matrix.isInputReadOnly,
            data: { row: row, question: matrix },
            action: () => {
              matrix.removeRowUI(row);
            },
          })
        );
      }
    }

    if (row.hasPanel) {
      actions.push(
        new Action({
          id: "show-detail",
          title: surveyLocalization.getString("editText"),
          showTitle: false,
          location: "start",
          component: "sv-matrix-detail-button",
          data: { row: row, question: this.matrix },
        })
      );
    }
  }
  private createHorizontalRow(
    row: MatrixDropdownRowModelBase,
    useAsHeader: boolean
  ): QuestionMatrixDropdownRenderedRow {
    var res = new QuestionMatrixDropdownRenderedRow(this.cssClasses);
    if (this.matrix.allowRowsDragAndDrop) {
      var rowIndex = this.matrix.visibleRows.indexOf(row);
      res.cells.push(this.getRowDragCell(rowIndex));
    }
    this.addRowActionsCell(row, res, "start");
    if (this.matrix.hasRowText) {
      var renderedCell = this.createTextCell(row.locText);
      renderedCell.row = row;
      res.cells.push(renderedCell);
      if (useAsHeader) {
        this.setHeaderCellWidth(null, renderedCell);
      }
      renderedCell.className = new CssClassBuilder()
        .append(renderedCell.className)
        .append(this.cssClasses.rowTextCell)
        .append(this.cssClasses.detailRowText, row.hasPanel)
        .toString();
    }
    for (var i = 0; i < row.cells.length; i++) {
      let cell = row.cells[i];
      if (!cell.column.hasVisibleCell) continue;
      if (cell.column.isShowInMultipleColumns) {
        this.createMutlipleEditCells(res, cell);
      } else {
        var renderedCell = this.createEditCell(cell);
        res.cells.push(renderedCell);
        if (useAsHeader) {
          this.setHeaderCellWidth(cell.column, renderedCell);
        }
      }
    }
    this.addRowActionsCell(row, res, "end");
    return res;
  }
  private addRowActionsCell(
    row: MatrixDropdownRowModelBase,
    renderedRow: QuestionMatrixDropdownRenderedRow,
    location: "start" | "end"
  ) {
    var rowIndex = this.matrix.visibleRows.indexOf(row);
    if (this.hasActionCellInRows(location)) {
      const actions = this.getRowActionsCell(rowIndex, location);
      if (!!actions) {
        renderedRow.cells.push(actions);
      } else {
        var cell = new QuestionMatrixDropdownRenderedCell();
        cell.isEmpty = true;
        renderedRow.cells.push(cell);
      }
    }
  }
  private createDetailPanelRow(
    row: MatrixDropdownRowModelBase,
    renderedRow: QuestionMatrixDropdownRenderedRow
  ): QuestionMatrixDropdownRenderedRow {
    var res = new QuestionMatrixDropdownRenderedRow(this.cssClasses, true);
    res.row = row;
    var buttonCell = new QuestionMatrixDropdownRenderedCell();
    if (this.matrix.hasRowText) {
      buttonCell.colSpans = 2;
    }
    buttonCell.isEmpty = true;
    res.cells.push(buttonCell);
    var actionsCell = null;
    if (this.hasActionCellInRows("end")) {
      actionsCell = new QuestionMatrixDropdownRenderedCell();
      actionsCell.isEmpty = true;
    }
    var cell = new QuestionMatrixDropdownRenderedCell();
    cell.panel = row.detailPanel;
    cell.colSpans =
      renderedRow.cells.length -
      buttonCell.colSpans -
      (!!actionsCell ? actionsCell.colSpans : 0);
    cell.className = this.cssClasses.detailPanelCell;
    res.cells.push(cell);
    if (!!actionsCell) {
      res.cells.push(actionsCell);
    }
    if (
      typeof this.matrix.onCreateDetailPanelRenderedRowCallback === "function"
    ) {
      this.matrix.onCreateDetailPanelRenderedRowCallback(res);
    }
    return res;
  }

  private buildVerticalRows(): Array<QuestionMatrixDropdownRenderedRow> {
    var columns = this.matrix.columns;
    var renderedRows = [];
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      if (col.isVisible && col.hasVisibleCell) {
        if (col.isShowInMultipleColumns) {
          this.createMutlipleVerticalRows(renderedRows, col, i);
        } else {
          renderedRows.push(this.createVerticalRow(col, i));
        }
      }
    }
    if (this.hasActionCellInRows("end")) {
      renderedRows.push(this.createEndVerticalActionRow());
    }
    return renderedRows;
  }
  private createMutlipleVerticalRows(
    renderedRows: Array<QuestionMatrixDropdownRenderedRow>,
    column: MatrixDropdownColumn,
    index: number
  ) {
    var choices = this.getMultipleColumnChoices(column);
    if (!choices) return;
    for (var i = 0; i < choices.length; i++) {
      renderedRows.push(this.createVerticalRow(column, index, choices[i], i));
    }
  }
  private createVerticalRow(
    column: MatrixDropdownColumn,
    index: number,
    choice: ItemValue = null,
    choiceIndex: number = -1
  ): QuestionMatrixDropdownRenderedRow {
    var res = new QuestionMatrixDropdownRenderedRow(this.cssClasses);
    if (this.matrix.showHeader) {
      var lTitle = !!choice ? choice.locText : column.locTitle;
      var hCell = this.createTextCell(lTitle);
      hCell.column = column;
      hCell.className = new CssClassBuilder()
        .append(hCell.className)
        .append(this.cssClasses.rowTextCell).toString();
      if (!choice) {
        this.setRequriedToHeaderCell(column, hCell);
      }
      res.cells.push(hCell);
    }
    var rows = this.matrix.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      var rChoice = choice;
      var rChoiceIndex = choiceIndex >= 0 ? choiceIndex : i;
      var cell = rows[i].cells[index];
      var visChoices = !!choice ? cell.question.visibleChoices : undefined;
      if (!!visChoices && rChoiceIndex < visChoices.length) {
        rChoice = visChoices[rChoiceIndex];
      }
      var rCell = this.createEditCell(cell, rChoice);
      rCell.item = rChoice;
      rCell.choiceIndex = rChoiceIndex;
      res.cells.push(rCell);
    }
    if (this.matrix.hasTotal) {
      res.cells.push(
        this.createEditCell(this.matrix.visibleTotalRow.cells[index])
      );
    }

    return res;
  }
  private createEndVerticalActionRow(): QuestionMatrixDropdownRenderedRow {
    var res = new QuestionMatrixDropdownRenderedRow(this.cssClasses);
    if (this.matrix.showHeader) {
      res.cells.push(this.createEmptyCell());
    }
    var rows = this.matrix.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      res.cells.push(this.getRowActionsCell(i, "end"));
    }
    if (this.matrix.hasTotal) {
      res.cells.push(this.createEmptyCell());
    }
    return res;
  }
  private createMutlipleEditCells(
    rRow: QuestionMatrixDropdownRenderedRow,
    cell: MatrixDropdownCell,
    isFooter: boolean = false
  ) {
    var choices = isFooter
      ? this.getMultipleColumnChoices(cell.column)
      : cell.question.visibleChoices;
    if (!choices) return;
    for (var i = 0; i < choices.length; i++) {
      var rCell = this.createEditCell(cell, !isFooter ? choices[i] : undefined);
      if (!isFooter) {
        //rCell.item = choices[i];
        rCell.choiceIndex = i;
      }
      rRow.cells.push(rCell);
    }
  }
  private createEditCell(
    cell: MatrixDropdownCell,
    choiceItem: any = undefined
  ): QuestionMatrixDropdownRenderedCell {
    var res = new QuestionMatrixDropdownRenderedCell();
    res.cell = cell;
    res.row = cell.row;
    res.question = cell.question;
    res.matrix = this.matrix;
    res.item = choiceItem;

    res.className = res.calculateFinalClassName(this.cssClasses);
    //res.css = res.calcCss(this.cssClasses.cell);

    // var questionCss = cell.question.cssClasses;
    // var className = "";
    // if (!!questionCss) {
    //   className = "";
    //   if (!!questionCss.itemValue) {
    //     className += " " + questionCss.itemValue;
    //   }
    //   if (!!questionCss.asCell) {
    //     if (!!className) className += "";
    //     className += questionCss.asCell;
    //   }
    // }
    // if (!className && !!this.cssClasses.cell) {
    //   className = this.cssClasses.cell;
    // }
    //res.className = className;
    return res;
  }
  private createMutlipleColumnsFooter(
    rRow: QuestionMatrixDropdownRenderedRow,
    cell: MatrixDropdownCell
  ) {
    this.createMutlipleEditCells(rRow, cell, true);
  }
  private createMutlipleColumnsHeader(column: MatrixDropdownColumn) {
    var choices = this.getMultipleColumnChoices(column);
    if (!choices) return;
    for (var i = 0; i < choices.length; i++) {
      var cell = this.createTextCell(choices[i].locText);
      this.setHeaderCell(column, cell);
      this.headerRow.cells.push(cell);
    }
  }
  private getMultipleColumnChoices(column: MatrixDropdownColumn): any {
    var choices = column.templateQuestion.choices;
    if (!!choices && Array.isArray(choices) && choices.length == 0)
      return this.matrix.choices;
    choices = column.templateQuestion.visibleChoices;
    if (!choices || !Array.isArray(choices)) return null;
    return choices;
  }
  private createHeaderCell(
    column: MatrixDropdownColumn
  ): QuestionMatrixDropdownRenderedCell {
    var cell = this.createTextCell(!!column ? column.locTitle : null);
    cell.column = column;
    this.setHeaderCell(column, cell);
    if (this.cssClasses.headerCell) {
      cell.className = this.cssClasses.headerCell;
    }
    return cell;
  }
  private setHeaderCell(
    column: MatrixDropdownColumn,
    cell: QuestionMatrixDropdownRenderedCell
  ) {
    this.setHeaderCellWidth(column, cell);
    this.setRequriedToHeaderCell(column, cell);
  }
  private setHeaderCellWidth(
    column: MatrixDropdownColumn,
    cell: QuestionMatrixDropdownRenderedCell
  ) {
    cell.minWidth = column != null ? this.matrix.getColumnWidth(column) : "";
    cell.width = column != null ? column.width : this.matrix.getRowTitleWidth();
  }
  private setRequriedToHeaderCell(
    column: MatrixDropdownColumn,
    cell: QuestionMatrixDropdownRenderedCell
  ) {
    if (!!column && column.isRequired && this.matrix.survey) {
      cell.requiredText = this.matrix.survey.requiredText;
    }
  }
  private createRemoveRowCell(
    row: MatrixDropdownRowModelBase
  ): QuestionMatrixDropdownRenderedCell {
    var res = new QuestionMatrixDropdownRenderedCell();
    res.row = row;
    res.isRemoveRow = this.canRemoveRow(row);
    if (!!this.cssClasses.cell) {
      res.className = this.cssClasses.cell;
    }
    return res;
  }
  private createTextCell(
    locTitle: LocalizableString
  ): QuestionMatrixDropdownRenderedCell {
    var cell = new QuestionMatrixDropdownRenderedCell();
    cell.locTitle = locTitle;
    if (!!this.cssClasses.cell) {
      cell.className = this.cssClasses.cell;
    }
    return cell;
  }
  private createEmptyCell(): QuestionMatrixDropdownRenderedCell {
    const res = this.createTextCell(null);
    res.isEmpty = true;
    return res;
  }
}