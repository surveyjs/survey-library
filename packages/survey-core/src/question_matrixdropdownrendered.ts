import { property, propertyArray } from "./jsonobject";
import { Question } from "./question";
import { Base } from "./base";
import { ItemValue } from "./itemvalue";
import { LocalizableString } from "./localizablestring";
import { PanelModel } from "./panel";
import { Action, IAction } from "./actions/action";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { MatrixDropdownColumn } from "./question_matrixdropdowncolumn";
import { MatrixDropdownCell, MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "./question_matrixdropdownbase";
import { ActionContainer } from "./actions/container";
import { QuestionMatrixDynamicModel } from "./question_matrixdynamic";
import { settings } from "./settings";
import { AnimationGroup, IAnimationConsumer, IAnimationGroupConsumer } from "./utils/animation";

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
  public isOtherChoice: boolean;
  public matrix: QuestionMatrixDropdownModelBase;
  public isEmpty: boolean;
  public colSpans: number = 1;
  public panel: PanelModel;
  public isShowHideDetail: boolean;
  public isActionsCell: boolean = false;
  public isErrorsCell: boolean = false;
  public isDragHandlerCell: boolean = false;
  public isDetailRowCell: boolean = false;
  private classNameValue: string = "";
  public constructor() {
    this.idValue = QuestionMatrixDropdownRenderedCell.counter++;
  }
  public get requiredText(): string {
    return this.column && this.column.isRenderedRequired ? this.column.requiredText : undefined;
  }
  public get hasQuestion(): boolean {
    return !!this.question && !this.isErrorsCell;
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
  public get isItemChoice(): boolean {
    return this.isChoice && !this.isOtherChoice;
  }
  public get choiceValue(): any {
    return this.isChoice ? this.item.value : null;
  }
  public get isCheckbox(): boolean {
    return this.isItemChoice && this.question.isDescendantOf("checkbox");
  }
  public get isRadio(): boolean {
    return this.isItemChoice && this.question.isDescendantOf("radiogroup");
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
  public get cellQuestionWrapperClassName(): string {
    return this.cell.getQuestionWrapperClassName(this.matrix.cssClasses.cellQuestionWrapper);
  }
  public get isVisible(): boolean {
    return (!this.hasQuestion && !this.isErrorsCell) || !this.matrix?.isMobile || this.question.isVisible;
  }
  public get showResponsiveTitle(): boolean {
    return this.hasQuestion && this.matrix?.isMobile;
  }
  public get responsiveTitleCss(): string {
    return new CssClassBuilder().append(this.matrix.cssClasses.cellResponsiveTitle).toString();
  }
  public get responsiveLocTitle(): LocalizableString {
    return this.cell.column.locTitle;
  }
  public get headers(): string {
    if (this.cell && this.cell.column) {
      if (this.matrix.IsMultiplyColumn(this.cell.column)) {
        if (!!this.item) {
          return this.item.locText.renderedHtml;
        } else {
          return "";
        }
      }
      let cellHint = this.cell.column.cellHint;
      if (!!cellHint) {
        if (cellHint.trim() === "") return "";
        return this.cell.column.locCellHint.renderedHtml;
      }
      if (this.hasQuestion && this.question.isVisible && this.question.title)
        return this.question.title;
      return this.cell.column.title;
    }
    if (this.hasQuestion && this.question.isVisible) {
      return this.question.locTitle.renderedHtml;
    }
    if (this.hasTitle) {
      return this.locTitle.renderedHtml || "";
    }
    return "";
  }
  getTitle(): string {
    return (this.matrix && this.matrix.showHeader) ? this.headers : "";
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
  public focusIn(): void {
    if (this.question) {
      this.question.focusIn();
    }
  }
}

export class QuestionMatrixDropdownRenderedRow extends Base {
  @property({ defaultValue: false }) isGhostRow: boolean;
  @property({ defaultValue: false }) isAdditionalClasses: boolean;
  @property({ defaultValue: true }) visible: boolean;
  public onVisibilityChangedCallback: () => void;
  public hasEndActions: boolean = false;
  public row: MatrixDropdownRowModelBase;
  public isErrorsRow = false;
  private static counter = 1;
  private idValue: number;
  public cells: Array<QuestionMatrixDropdownRenderedCell> = [];

  public constructor(public cssClasses: any, public isDetailRow: boolean = false) {
    super();
    this.idValue = QuestionMatrixDropdownRenderedRow.counter++;
  }
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
      .append(this.cssClasses.rowHasPanel, this.row?.hasPanel)
      .append(this.cssClasses.expandedRow, this.row?.isDetailPanelShowing && !this.isDetailRow)
      .append(this.cssClasses.rowHasEndActions, this.hasEndActions)
      .append(this.cssClasses.ghostRow, this.isGhostRow)
      .append(this.cssClasses.rowAdditional, this.isAdditionalClasses)
      .toString();
  }
  private rootElement: HTMLTableRowElement;
  public setRootElement(val: HTMLTableRowElement): void {
    this.rootElement = val;
  }
  public getRootElement(): HTMLTableRowElement {
    return this.rootElement;
  }
}
export class QuestionMatrixDropdownRenderedErrorRow extends QuestionMatrixDropdownRenderedRow {
  public isErrorsRow: boolean = true;

  constructor(cssClasses: any) {
    super(cssClasses);
  }
  public get attributes() {
    return {};
  }
  public get className(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.row)
      .append(this.cssClasses.errorRow)
      .toString();
  }
  public onAfterCreated(): void {
    const callback = () => {
      this.visible = this.cells.some((cell) => cell.question && cell.question.hasVisibleErrors);
    };
    this.cells.forEach((cell) => {
      if (cell.question) {
        cell.question.registerFunctionOnPropertyValueChanged("hasVisibleErrors", callback);
      }
    });
    callback();
  }
}

export class QuestionMatrixDropdownRenderedTable extends Base {
  private headerRowValue: QuestionMatrixDropdownRenderedRow;
  private footerRowValue: QuestionMatrixDropdownRenderedRow;
  private hasRemoveRowsValue: boolean;
  private rowsActions: Array<Array<IAction>>;
  private cssClasses: any;
  @propertyArray({
    onPush: (_: any, i: number, target: QuestionMatrixDropdownRenderedTable) => {
      target.updateRenderedRows();
    },
    onRemove: (_: any, i: number, target: QuestionMatrixDropdownRenderedTable) => {
      target.updateRenderedRows();
    }
  }) rows: Array<QuestionMatrixDropdownRenderedRow>;
  protected getIsAnimationAllowed(): boolean {
    return super.getIsAnimationAllowed() && this.matrix.animationAllowed;
  }
  private getRenderedRowsAnimationOptions(): IAnimationGroupConsumer<QuestionMatrixDropdownRenderedRow> {
    const beforeAnimationRun = (el: HTMLElement) => {
      el.querySelectorAll(":scope > td > *").forEach((el: HTMLElement) => {
        el.style.setProperty("--animation-height", el.offsetHeight + "px");
      });
    };
    return {
      isAnimationEnabled: () => {
        return this.animationAllowed;
      },
      getRerenderEvent: () => this.onElementRerendered,
      getAnimatedElement(el: QuestionMatrixDropdownRenderedRow) {
        return el.getRootElement();
      },
      getLeaveOptions: () => {
        return { cssClass: this.cssClasses.rowFadeOut, onBeforeRunAnimation: beforeAnimationRun };
      },
      getEnterOptions: () => {
        return { cssClass: this.cssClasses.rowFadeIn, onBeforeRunAnimation: beforeAnimationRun };
      }
    };
  }

  @propertyArray() private _renderedRows: Array<QuestionMatrixDropdownRenderedRow> = [];
  public updateRenderedRows(): void {
    this.renderedRows = this.rows;
  }
  private renderedRowsAnimation = new AnimationGroup(this.getRenderedRowsAnimationOptions(), (val) => {
    this._renderedRows = val;
  }, () => this._renderedRows)

  public get renderedRows(): Array<QuestionMatrixDropdownRenderedRow> {
    return this._renderedRows;
  }
  public set renderedRows(val: Array<QuestionMatrixDropdownRenderedRow>) {
    this.renderedRowsAnimation.sync(val);
  }

  public constructor(public matrix: QuestionMatrixDropdownModelBase) {
    super();
    this.build();
  }
  public get showTable(): boolean {
    return this.getPropertyValue("showTable", true);
  }
  public get showHeader(): boolean {
    return this.getPropertyValue("showHeader");
  }
  public get showAddRow(): boolean {
    return this.getPropertyValue("showAddRow", false);
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
  public get isRowsDragAndDrop(): boolean {
    return this.matrix.isRowsDragAndDrop && this.matrix.isColumnLayoutHorizontal;
  }

  private get showCellErrorsTop() {
    //todo
    return this.matrix.getErrorLocation() === "top";
  }
  private get showCellErrorsBottom() {
    //todo
    return this.matrix.getErrorLocation() === "bottom";
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
        showAddRowOnTop = !this.matrix.isColumnLayoutHorizontal;
      } else {
        showAddRowOnTop = this.matrix.getAddRowLocation() !== "bottom";
      }
    }
    if (showAddRowOnBottom && this.matrix.getAddRowLocation() !== "topBottom") {
      showAddRowOnBottom = !showAddRowOnTop;
    }
    this.setPropertyValue("showAddRow", this.matrix.canAddRow);
    this.setPropertyValue("showAddRowOnTop", showAddRowOnTop);
    this.setPropertyValue("showAddRowOnBottom", showAddRowOnBottom);
  }
  public onAddedRow(row: MatrixDropdownRowModelBase, index: number): void {
    if (this.getRenderedDataRowCount() >= this.matrix.visibleRows.length)
      return;
    let rowIndex = this.getRenderedRowIndexByIndex(index);
    this.rowsActions.splice(index, 0, this.buildRowActions(row));
    this.addHorizontalRow(this.rows, row,
      this.matrix.visibleRows.length == 1 && !this.matrix.showHeader, rowIndex);
    this.updateShowTableAndAddRow();
  }
  private getRenderedRowIndexByIndex(index: number): number {
    let res = 0;
    let dataRowIndex = 0;
    for (var i = 0; i < this.rows.length; i++) {
      if (dataRowIndex === index) {
        if (this.rows[i].isErrorsRow || this.rows[i].isDetailRow) res++;
        break;
      }
      res++;
      if (!(this.rows[i].isErrorsRow) && !this.rows[i].isDetailRow) dataRowIndex++;
    }
    if (dataRowIndex < index) return this.rows.length;
    return res;
  }
  private getRenderedDataRowCount(): number {
    var res = 0;
    for (var i = 0; i < this.rows.length; i++) {
      if (!(this.rows[i].isErrorsRow) && !this.rows[i].isDetailRow) res++;
    }
    return res;
  }

  public onRemovedRow(row: MatrixDropdownRowModelBase) {
    var rowIndex = this.getRenderedRowIndex(row);
    if (rowIndex < 0) return;
    this.rowsActions.splice(rowIndex, 1);
    var removeCount = 1;
    if (
      rowIndex < this.rows.length - 1 && this.showCellErrorsBottom &&
      this.rows[rowIndex + 1].isErrorsRow
    ) {
      removeCount++;
    }
    if (
      rowIndex < this.rows.length - 1 &&
      (this.rows[rowIndex + 1].isDetailRow ||
        this.showCellErrorsBottom && rowIndex + 1 < this.rows.length - 1 && this.rows[rowIndex + 2].isDetailRow
      )
    ) {
      removeCount++;
    }
    if (rowIndex > 0 && this.showCellErrorsTop && this.rows[rowIndex - 1].isErrorsRow) {
      rowIndex--;
      removeCount++;
    }
    this.rows.splice(rowIndex, removeCount);
    this.updateShowTableAndAddRow();
  }
  public onDetailPanelChangeVisibility(
    row: MatrixDropdownRowModelBase,
    isShowing: boolean
  ) {
    const rowIndex = this.getRenderedRowIndex(row);
    if (rowIndex < 0) return;
    let currentIndex = rowIndex;
    if (this.showCellErrorsBottom) currentIndex++;
    var panelRowIndex =
      currentIndex < this.rows.length - 1 && this.rows[currentIndex + 1].isDetailRow
        ? currentIndex + 1
        : -1;
    if ((isShowing && panelRowIndex > -1) || (!isShowing && panelRowIndex < 0))
      return;
    if (isShowing) {
      var detailRow = this.createDetailPanelRow(row, this.rows[rowIndex]);
      this.rows.splice(currentIndex + 1, 0, detailRow);
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
  protected createRenderedRow(cssClasses: any, isDetailRow: boolean = false) {
    return new QuestionMatrixDropdownRenderedRow(cssClasses, isDetailRow);
  }
  protected createErrorRenderedRow(cssClasses: any): QuestionMatrixDropdownRenderedErrorRow {
    return new QuestionMatrixDropdownRenderedErrorRow(cssClasses);
  }
  protected buildHeader() {
    var colHeaders =
      this.matrix.isColumnLayoutHorizontal && this.matrix.showHeader;
    var isShown =
      colHeaders ||
      (this.matrix.hasRowText && !this.matrix.isColumnLayoutHorizontal);
    this.setPropertyValue("showHeader", isShown);
    if (!isShown) return;
    this.headerRowValue = this.createRenderedRow(this.cssClasses);
    if (this.isRowsDragAndDrop) {
      this.headerRow.cells.push(this.createHeaderCell(null, "action"));
    }
    if (this.hasActionCellInRows("start")) {
      this.headerRow.cells.push(this.createHeaderCell(null, "action"));
    }
    if (this.matrix.hasRowText && this.matrix.showHeader) {
      this.headerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.matrix.isColumnLayoutHorizontal) {
      for (var i = 0; i < this.matrix.visibleColumns.length; i++) {
        var column = this.matrix.visibleColumns[i];
        if (!column.isColumnVisible) continue;
        if (this.matrix.IsMultiplyColumn(column)) {
          this.createMutlipleColumnsHeader(column);
        } else {
          this.headerRow.cells.push(this.createHeaderCell(column));
        }
      }
    } else {
      var rows = this.matrix.visibleRows;
      for (var i = 0; i < rows.length; i++) {
        const cell = this.createTextCell(rows[i].locText);
        this.setHeaderCellCssClasses(cell);
        cell.row = rows[i];
        this.headerRow.cells.push(cell);
      }
      if (this.matrix.hasFooter) {
        const cell = this.createTextCell(this.matrix.getFooterText());
        this.setHeaderCellCssClasses(cell);
        this.headerRow.cells.push(cell);
      }
    }
    if (this.hasActionCellInRows("end")) {
      this.headerRow.cells.push(this.createHeaderCell(null, "action"));
    }
  }
  protected buildFooter() {
    if (!this.showFooter) return;
    this.footerRowValue = this.createRenderedRow(this.cssClasses);
    if (this.isRowsDragAndDrop) {
      this.footerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.hasActionCellInRows("start")) {
      this.footerRow.cells.push(this.createHeaderCell(null, "action"));
    }
    if (this.matrix.hasRowText) {
      const cell = this.createTextCell(this.matrix.getFooterText());
      cell.className = new CssClassBuilder().append(cell.className)
        .append(this.cssClasses.footerTotalCell).toString();
      this.footerRow.cells.push(cell);
    }
    var cells = this.matrix.visibleTotalRow.cells;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (!cell.column.isColumnVisible) continue;
      if (this.matrix.IsMultiplyColumn(cell.column)) {
        this.createMutlipleColumnsFooter(this.footerRow, cell);
      } else {
        var editCell = this.createEditCell(cell);
        if (cell.column) {
          this.setHeaderCellWidth(cell.column, editCell);
        }
        editCell.className = new CssClassBuilder().append(editCell.className)
          .append(this.cssClasses.footerCell).toString();
        this.footerRow.cells.push(editCell);
      }
    }
    if (this.hasActionCellInRows("end")) {
      this.footerRow.cells.push(this.createHeaderCell(null, "action"));
    }
  }
  protected buildRows() {
    this.blockAnimations();
    var rows = this.matrix.isColumnLayoutHorizontal
      ? this.buildHorizontalRows()
      : this.buildVerticalRows();
    this.rows = rows;
    this.releaseAnimations();
  }
  private hasActionCellInRowsValues: any = {};
  private hasActionCellInRows(location: "start" | "end"): boolean {
    if (this.hasActionCellInRowsValues[location] === undefined) {
      this.hasActionCellInRowsValues[location] = this.hasActionsCellInLocaltion(location);
    }
    return this.hasActionCellInRowsValues[location];
  }
  private hasActionsCellInLocaltion(location: "start" | "end"): boolean {
    if (location == "end" && this.hasRemoveRows) return true;
    return this.matrix.visibleRows.some(
      (row, index) => !this.isValueEmpty(this.getRowActions(index, location)));
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
    useAsHeader: boolean, index: number = -1
  ) {
    const renderedRow = this.createHorizontalRow(row, useAsHeader);
    const errorRow = this.createErrorRow(renderedRow);
    renderedRow.row = row;
    if (index < 0) {
      index = renderedRows.length;
    }
    if (this.matrix.isMobile) {
      const cells = [];
      for (let i = 0; i < renderedRow.cells.length; i++) {
        if (this.showCellErrorsTop && !errorRow.cells[i].isEmpty) {
          cells.push(errorRow.cells[i]);
        }
        cells.push(renderedRow.cells[i]);
        if (this.showCellErrorsBottom && !errorRow.cells[i].isEmpty) {
          cells.push(errorRow.cells[i]);
        }
      }
      renderedRow.cells = cells;
      renderedRows.splice(index, 0, renderedRow);
    } else {
      renderedRows.splice(index, 0, ...(this.showCellErrorsTop ? [errorRow, renderedRow] : [renderedRow, errorRow]));
      index++;
    }
    if (row.isDetailPanelShowing) {
      renderedRows.splice(index + 1, 0, this.createDetailPanelRow(row, renderedRow));
    }
  }
  private getRowDragCell(rowIndex: number) {
    const cell = new QuestionMatrixDropdownRenderedCell();
    const lockedRows = (<QuestionMatrixDynamicModel>this.matrix).lockedRowCount;
    cell.isDragHandlerCell = lockedRows < 1 || rowIndex >= lockedRows;
    cell.isEmpty = !cell.isDragHandlerCell;
    cell.className = this.getActionsCellClassName(cell);
    cell.row = this.matrix.visibleRows[rowIndex];
    return cell;
  }
  private getActionsCellClassName(cell: QuestionMatrixDropdownRenderedCell = null): string {
    const classBuilder =
      new CssClassBuilder()
        .append(this.cssClasses.actionsCell)
        .append(this.cssClasses.actionsCellDrag, cell?.isDragHandlerCell)
        .append(this.cssClasses.detailRowCell, cell?.isDetailRowCell)
        .append(this.cssClasses.verticalCell, !this.matrix.isColumnLayoutHorizontal);
    if (cell.isActionsCell) {
      const actions = (cell.item.value as ActionContainer).actions;
      if (this.cssClasses.actionsCellPrefix) {
        actions.forEach(action => {
          classBuilder.append(this.cssClasses.actionsCellPrefix + "--" + action.id);
        });
      }
    }
    return classBuilder.toString();
  }
  private getRowActionsCell(rowIndex: number, location: "start" | "end", isDetailRow: boolean = false) {
    const rowActions = this.getRowActions(rowIndex, location);
    if (!this.isValueEmpty(rowActions)) {
      const cell = new QuestionMatrixDropdownRenderedCell();
      const actionContainer = this.matrix.allowAdaptiveActions ? new AdaptiveActionContainer() : new ActionContainer();
      if (!!this.matrix.survey && this.matrix.survey.getCss().actionBar) {
        actionContainer.cssClasses = this.matrix.survey.getCss().actionBar;
      }
      actionContainer.setItems(rowActions);

      const itemValue = new ItemValue(actionContainer);
      cell.item = itemValue;
      cell.isActionsCell = true;
      cell.isDragHandlerCell = false;
      cell.isDetailRowCell = isDetailRow;
      cell.className = this.getActionsCellClassName(cell);
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
      settings.matrix.renderRemoveAsIcon && this.matrix.survey && (<any>this.matrix.survey).css.root === "sd-root-modern"
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
            iconSize: "auto",
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
      if (this.matrix.isMobile) {
        actions.unshift(
          new Action({
            id: "show-detail-mobile",
            title: "Show Details",
            showTitle: true,
            location: "end",
            action: (context) => {
              context.title = row.isDetailPanelShowing ? this.matrix.getLocalizationString("showDetails") : this.matrix.getLocalizationString("hideDetails");
              row.showHideDetailPanelClick();
            },
          })
        );
      } else {
        actions.push(
          new Action({
            id: "show-detail",
            title: this.matrix.getLocalizationString("editText"),
            showTitle: false,
            location: "start",
            component: "sv-matrix-detail-button",
            data: { row: row, question: this.matrix },
          })
        );
      }
    }
  }
  private createErrorRow(
    row: QuestionMatrixDropdownRenderedRow
  ): QuestionMatrixDropdownRenderedRow {
    const res = this.createErrorRenderedRow(this.cssClasses);
    for (let i = 0; i < row.cells.length; i++) {
      const cell = row.cells[i];
      if (!cell.hasQuestion) {
        res.cells.push(this.createEmptyCell(true));
      }
      else if (this.matrix.IsMultiplyColumn(cell.cell.column)) {
        if (cell.isFirstChoice) {
          res.cells.push(this.createErrorCell(cell.cell));
        } else {
          res.cells.push(this.createEmptyCell(true));
        }
      }
      else {
        res.cells.push(this.createErrorCell(cell.cell));
      }
    }
    res.onAfterCreated();
    return res;
  }
  private createHorizontalRow(
    row: MatrixDropdownRowModelBase,
    useAsHeader: boolean
  ): QuestionMatrixDropdownRenderedRow {
    var res = this.createRenderedRow(this.cssClasses);
    if (this.isRowsDragAndDrop) {
      var rowIndex = this.matrix.visibleRows.indexOf(row);
      res.cells.push(this.getRowDragCell(rowIndex));
    }
    this.addRowActionsCell(row, res, "start");
    if (this.matrix.hasRowText) {
      var renderedCell = this.createTextCell(row.locText);
      renderedCell.row = row;
      res.cells.push(renderedCell);
      this.setHeaderCellWidth(null, renderedCell);

      renderedCell.className = new CssClassBuilder()
        .append(renderedCell.className)
        .append(this.cssClasses.rowTextCell)
        .append(this.cssClasses.columnTitleCell, !this.matrix.isColumnLayoutHorizontal)
        .append(this.cssClasses.detailRowText, row.hasPanel)
        .toString();
    }
    for (var i = 0; i < row.cells.length; i++) {
      let cell = row.cells[i];
      if (!cell.column.isColumnVisible) continue;
      if (this.matrix.IsMultiplyColumn(cell.column)) {
        this.createMutlipleEditCells(res, cell);
      } else {
        if (cell.column.isShowInMultipleColumns) {
          cell.question.visibleChoices.map((c: ItemValue) => c.hideCaption = false);
        }
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
      const actions = this.getRowActionsCell(rowIndex, location, renderedRow.isDetailRow);
      if (!!actions) {
        renderedRow.cells.push(actions);
        renderedRow.hasEndActions = true;
      } else {
        var cell = new QuestionMatrixDropdownRenderedCell();
        cell.isEmpty = true;
        cell.isDetailRowCell = renderedRow.isDetailRow;
        renderedRow.cells.push(cell);
      }
    }
  }
  private createDetailPanelRow(
    row: MatrixDropdownRowModelBase,
    renderedRow: QuestionMatrixDropdownRenderedRow
  ): QuestionMatrixDropdownRenderedRow {
    const panelFullWidth: boolean = this.matrix.isDesignMode;
    var res = this.createRenderedRow(this.cssClasses, true);
    res.row = row;
    var buttonCell = new QuestionMatrixDropdownRenderedCell();
    if (this.matrix.hasRowText) {
      buttonCell.colSpans = 2;
    }
    buttonCell.isEmpty = true;
    if (!panelFullWidth) res.cells.push(buttonCell);
    var actionsCell = null;
    if (this.hasActionCellInRows("end")) {
      actionsCell = new QuestionMatrixDropdownRenderedCell();
      actionsCell.isEmpty = true;
    }
    var cell = new QuestionMatrixDropdownRenderedCell();
    cell.panel = row.detailPanel;
    cell.colSpans =
      renderedRow.cells.length -
      (!panelFullWidth ? buttonCell.colSpans : 0) -
      (!!actionsCell ? actionsCell.colSpans : 0);
    cell.className = this.cssClasses.detailPanelCell;
    res.cells.push(cell);

    if (!!actionsCell) {
      if (this.matrix.isMobile) {
        this.addRowActionsCell(row, res, "end");
      } else {
        res.cells.push(actionsCell);
      }
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
      if (col.isColumnVisible) {
        if (this.matrix.IsMultiplyColumn(col)) {
          this.createMutlipleVerticalRows(renderedRows, col, i);
        } else {
          const renderedRow = this.createVerticalRow(col, i);
          const errorRow = this.createErrorRow(renderedRow);
          if (this.showCellErrorsTop) {
            renderedRows.push(errorRow);
            renderedRows.push(renderedRow);
          } else {
            renderedRows.push(renderedRow);
            renderedRows.push(errorRow);
          }
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
      const renderedRow = this.createVerticalRow(column, index, choices[i], i);
      const errorRow = this.createErrorRow(renderedRow);
      if (this.showCellErrorsTop) {
        renderedRows.push(errorRow);
        renderedRows.push(renderedRow);
      } else {
        renderedRows.push(renderedRow);
        renderedRows.push(errorRow);
      }
    }
  }
  private createVerticalRow(
    column: MatrixDropdownColumn,
    index: number,
    choice: ItemValue = null,
    choiceIndex: number = -1
  ): QuestionMatrixDropdownRenderedRow {
    var res = this.createRenderedRow(this.cssClasses);
    if (this.matrix.showHeader) {
      var lTitle = !!choice ? choice.locText : column.locTitle;
      var hCell = this.createTextCell(lTitle);
      hCell.column = column;
      hCell.className = new CssClassBuilder()
        .append(hCell.className)
        .append(this.cssClasses.rowTextCell)
        .append(this.cssClasses.columnTitleCell).toString();
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
    var res = this.createRenderedRow(this.cssClasses);
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
        this.setItemCellCssClasses(rCell);
        rCell.choiceIndex = i;
      }
      rRow.cells.push(rCell);
    }
  }
  private setItemCellCssClasses(cell: QuestionMatrixDropdownRenderedCell) {
    cell.className = new CssClassBuilder()
      .append(this.cssClasses.cell)
      .append(this.cssClasses.itemCell)
      .append(this.cssClasses.radioCell, cell.isRadio)
      .append(this.cssClasses.checkboxCell, cell.isCheckbox)
      .toString();
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
    res.isOtherChoice = !!choiceItem && !!cell.question && cell.question.otherItem === choiceItem;

    res.className = res.calculateFinalClassName(this.cssClasses);
    return res;
  }
  private createErrorCell(
    cell: MatrixDropdownCell,
    choiceItem: any = undefined
  ): QuestionMatrixDropdownRenderedCell {
    var res = new QuestionMatrixDropdownRenderedCell();
    res.question = cell.question;
    res.row = cell.row;
    res.matrix = this.matrix;
    res.isErrorsCell = true;
    res.className = new CssClassBuilder()
      .append(this.cssClasses.cell)
      .append(this.cssClasses.errorsCell)
      .append(this.cssClasses.errorsCellTop, this.showCellErrorsTop)
      .append(this.cssClasses.errorsCellBottom, this.showCellErrorsBottom)
      .toString();
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
      this.setHeaderCellCssClasses(cell);
      this.headerRow.cells.push(cell);
    }
  }
  private getMultipleColumnChoices(column: MatrixDropdownColumn): any {
    var choices = column.templateQuestion.choices;
    if (!!choices && Array.isArray(choices) && choices.length == 0)
      return [].concat(this.matrix.choices, column.getVisibleMultipleChoices());
    choices = column.getVisibleMultipleChoices();
    if (!choices || !Array.isArray(choices)) return null;
    return choices;
  }
  private setHeaderCellCssClasses(cell: QuestionMatrixDropdownRenderedCell, cellType?: string): void {
    cell.className = new CssClassBuilder()
      .append(this.cssClasses.headerCell)
      .append(this.cssClasses.columnTitleCell, this.matrix.isColumnLayoutHorizontal)
      .append(this.cssClasses.emptyCell, !!cell.isEmpty)
      .append(this.cssClasses.cell + "--" + cellType, !!cellType)
      .toString();
  }
  private createHeaderCell(
    column: MatrixDropdownColumn,
    cellType: string = null
  ): QuestionMatrixDropdownRenderedCell {
    let cell = !!column ? this.createTextCell(column.locTitle) : this.createEmptyCell();
    cell.column = column;
    this.setHeaderCell(column, cell);
    if (!cellType) cellType = (!!column && column.cellType !== "default") ? column.cellType : this.matrix.cellType;
    this.setHeaderCellCssClasses(cell, cellType);
    return cell;
  }
  private setHeaderCell(
    column: MatrixDropdownColumn,
    cell: QuestionMatrixDropdownRenderedCell
  ) {
    this.setHeaderCellWidth(column, cell);
  }
  private setHeaderCellWidth(
    column: MatrixDropdownColumn,
    cell: QuestionMatrixDropdownRenderedCell
  ) {
    cell.minWidth = column != null ? this.matrix.getColumnWidth(column) : this.matrix.getRowTitleWidth();
    cell.width = column != null ? column.width : this.matrix.getRowTitleWidth();
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
  private createEmptyCell(isError: boolean = false): QuestionMatrixDropdownRenderedCell {
    const res = this.createTextCell(null);
    res.isEmpty = true;
    res.className = new CssClassBuilder()
      .append(this.cssClasses.cell)
      .append(this.cssClasses.emptyCell)
      .append(this.cssClasses.errorsCell, isError)
      .toString();
    return res;
  }
}