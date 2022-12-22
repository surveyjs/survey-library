import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { IConditionObject, Question } from "./question";
import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData
} from "./question_matrixdropdownbase";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";
import { SurveyError } from "./survey-error";
import { MinRowCountError } from "./error";
import { IAction } from "./actions/action";
import { settings } from "./settings";
import { confirmAction } from "./utils/utils";
import { DragDropMatrixRows } from "./dragdrop/matrix-rows";
import { IShortcutText, ISurveyImpl, IProgressInfo } from "./base-interfaces";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";
import { MatrixDropdownColumn } from "./question_matrixdropdowncolumn";
import { DragOrClickHelper } from "./utils/dragOrClickHelper";
import { Helpers } from "./helpers";

export class MatrixDynamicRowModel extends MatrixDropdownRowModelBase implements IShortcutText {
  private dragOrClickHelper: DragOrClickHelper;

  constructor(public index: number, data: IMatrixDropdownData, value: any) {
    super(data, value);
    this.buildCells(value);
  }
  public get rowName() {
    return this.id;
  }

  public get shortcutText(): string {
    const matrix = <QuestionMatrixDynamicModel>this.data;
    const index = matrix.visibleRows.indexOf(this) + 1;
    const questionValue1 = this.cells.length > 1 ? this.cells[1]["questionValue"] : undefined;
    const questionValue0 = this.cells.length > 0 ? this.cells[0]["questionValue"] : undefined;
    return (
      questionValue1 && questionValue1.value ||
      questionValue0 && questionValue0.value ||
      "" + index
    );
  }
}

/**
  * A class that describes the Dynamic Matrix question type.
  *
  * Dynamic Matrix allows respondents to add and delete matrix rows. You can use the [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Checkbox](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radiogroup](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Text](https://surveyjs.io/form-library/documentation/questiontextmodel), and [Comment](https://surveyjs.io/form-library/documentation/questioncommentmodel) question types as cell editors.
  *
  * [View Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/ (linkStyle))
  */
export class QuestionMatrixDynamicModel extends QuestionMatrixDropdownModelBase
  implements IMatrixDropdownData {
  public onGetValueForNewRowCallBack: (
    sender: QuestionMatrixDynamicModel
  ) => any;
  private rowCounter = 0;
  private initialRowCount: number = 2;
  private setRowCountValueFromData: boolean = false;

  constructor(name: string) {
    super(name);
    this.createLocalizableString("confirmDeleteText", this, false, "confirmDelete");
    var locAddRowText = this.createLocalizableString("addRowText", this);
    locAddRowText.onGetTextCallback = (text: string): string => {
      return !!text ? text : this.defaultAddRowText;
    };
    this.createLocalizableString("removeRowText", this, false, "removeRow");
    this.createLocalizableString("emptyRowsText", this, false, true);
    this.registerPropertyChangedHandlers(
      ["hideColumnsIfEmpty", "allowAddRows"],
      () => {
        this.updateShowTableAndAddRow();
      }
    );
    this.registerPropertyChangedHandlers(["allowRowsDragAndDrop"], () => { this.clearRowsAndResetRenderedTable(); });
    this.dragOrClickHelper = new DragOrClickHelper(this.startDragMatrixRow);
  }

  public dragDropMatrixRows: DragDropMatrixRows;
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
    super.setSurveyImpl(value, isLight);
    this.dragDropMatrixRows = new DragDropMatrixRows(this.survey);
  }

  private draggedRow: MatrixDropdownRowModelBase;
  private isBanStartDrag(pointerDownEvent: PointerEvent): boolean {
    const target = (<HTMLElement>pointerDownEvent.target);
    return target.getAttribute("contenteditable") === "true" || target.nodeName === "INPUT";
  }
  public onPointerDown(pointerDownEvent: PointerEvent, row: MatrixDropdownRowModelBase):void {
    if (!row || !this.allowRowsDragAndDrop) return;
    if (this.isBanStartDrag(pointerDownEvent)) return;
    if (row.isDetailPanelShowing) return;
    this.draggedRow = row;
    this.dragOrClickHelper.onPointerDown(pointerDownEvent);
  }

  public startDragMatrixRow = (event: PointerEvent, currentTarget: HTMLElement): void => {
    this.dragDropMatrixRows.startDrag(event, this.draggedRow, this, <HTMLElement>event.target);
  }

  public getType(): string {
    return "matrixdynamic";
  }

  public get isRowsDynamic(): boolean {
    return true;
  }
  /**
   * Specifies whether to display a confirmation dialog when a respondent wants to delete a row.
   * @see confirmDeleteText
   */
  public get confirmDelete(): boolean {
    return this.getPropertyValue("confirmDelete", false);
  }
  public set confirmDelete(val: boolean) {
    this.setPropertyValue("confirmDelete", val);
  }
  /**
   * Specifies a key column. Set this property to a column name, and the question will display `keyDuplicationError` if a user tries to enter a duplicate value in this column.
   * @see keyDuplicationError
   */
  public get keyName(): string {
    return this.getPropertyValue("keyName", "");
  }
  public set keyName(val: string) {
    this.setPropertyValue("keyName", val);
  }
  /**
   * If it is not empty, then this value is set to every new row, including rows created initially, unless the defaultValue is not empty
   * @see defaultValue
   * @see defaultValueFromLastRow
   */
  public get defaultRowValue(): any {
    return this.getPropertyValue("defaultRowValue");
  }
  public set defaultRowValue(val: any) {
    this.setPropertyValue("defaultRowValue", val);
  }
  /**
   * Specifies whether default values for a new row/column should be copied from the last row/column.
   *
   * If you also specify `defaultValue`, it will be merged with the copied values.
   * @see defaultValue
   */
  public get defaultValueFromLastRow(): boolean {
    return this.getPropertyValue("defaultValueFromLastRow", false);
  }
  public set defaultValueFromLastRow(val: boolean) {
    this.setPropertyValue("defaultValueFromLastRow", val);
  }
  protected isDefaultValueEmpty(): boolean {
    return (
      super.isDefaultValueEmpty() && this.isValueEmpty(this.defaultRowValue)
    );
  }
  protected valueFromData(val: any): any {
    if (this.minRowCount < 1) return super.valueFromData(val);
    if (!Array.isArray(val)) val = [];
    for (var i = val.length; i < this.minRowCount; i++) val.push({});
    return val;
  }
  protected setDefaultValue() {
    if (
      this.isValueEmpty(this.defaultRowValue) ||
      !this.isValueEmpty(this.defaultValue)
    ) {
      super.setDefaultValue();
      return;
    }
    if (!this.isEmpty() || this.rowCount == 0) return;
    var newValue = [];
    for (var i = 0; i < this.rowCount; i++) {
      newValue.push(this.defaultRowValue);
    }
    this.value = newValue;
  }
  public moveRowByIndex = (fromIndex: number, toIndex: number):void => {
    const value = this.createNewValue();

    if (!value) return;

    const movableRow = value[fromIndex];

    if (!movableRow) return;

    value.splice(fromIndex, 1);
    value.splice(toIndex, 0, movableRow);

    this.value = value;
  };
  /**
   * The number of rows in the matrix.
   * @see minRowCount
   * @see maxRowCount
   */
  public get rowCount(): number {
    return this.rowCountValue;
  }
  public set rowCount(val: number) {
    if (val < 0 || val > settings.matrixMaximumRowCount) return;
    this.setRowCountValueFromData = false;
    var prevValue = this.rowCountValue;
    this.rowCountValue = val;
    if (this.value && this.value.length > val) {
      var qVal = this.value;
      qVal.splice(val);
      this.value = qVal;
    }
    if (this.isUpdateLocked) {
      this.initialRowCount = val;
      return;
    }
    if (this.generatedVisibleRows || prevValue == 0) {
      if (!this.generatedVisibleRows) {
        this.generatedVisibleRows = [];
      }
      this.generatedVisibleRows.splice(val);
      for (var i = prevValue; i < val; i++) {
        var newRow = this.createMatrixRow(this.getValueForNewRow());
        this.generatedVisibleRows.push(newRow);
        this.onMatrixRowCreated(newRow);
      }
      this.runCondition(this.getDataFilteredValues(), this.getDataFilteredProperties());
    }
    this.onRowsChanged();
  }
  protected updateProgressInfoByValues(res: IProgressInfo): void {
    let val = this.value;
    if(!Array.isArray(val)) val = [];
    for(var i = 0; i < this.rowCount; i ++) {
      const rowValue = i < val.length ? val[i] : {};
      this.updateProgressInfoByRow(res, rowValue);
    }
  }
  private getValueForNewRow(): any {
    var res = null;
    if (!!this.onGetValueForNewRowCallBack) {
      res = this.onGetValueForNewRowCallBack(this);
    }
    return res;
  }
  /**
   * Specifies whether users can drag and drop matrix rows to reorder them.
   *
   * Default value: `false`
   */
  public get allowRowsDragAndDrop(): boolean {
    if (this.readOnly) return false;
    return this.getPropertyValue("allowRowsDragAndDrop");
  }
  public set allowRowsDragAndDrop(val: boolean) {
    this.setPropertyValue("allowRowsDragAndDrop", val);
  }

  public get iconDragElement(): string {
    return this.cssClasses.iconDragElement;
  }

  protected createRenderedTable(): QuestionMatrixDropdownRenderedTable {
    return new QuestionMatrixDynamicRenderedTable(this);
  }

  private get rowCountValue(): number {
    return this.getPropertyValue("rowCount");
  }
  private set rowCountValue(val: number) {
    this.setPropertyValue("rowCount", val);
  }
  /**
   * A minimum number of rows in the matrix. Users cannot delete rows if `rowCount` equals `minRowCount`.
   *
   * Default value: 0
   * @see rowCount
   * @see maxRowCount
   * @see allowRemoveRows
   */
  public get minRowCount(): number {
    return this.getPropertyValue("minRowCount");
  }
  public set minRowCount(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("minRowCount", val);
    if (val > this.maxRowCount) this.maxRowCount = val;
    if (this.rowCount < val) this.rowCount = val;
  }
  /**
   * A maximum number of rows in the matrix. Users cannot add new rows if `rowCount` equals `maxRowCount`.
   *
   * Default value: 1000 (inherited from [`settings.matrixMaximumRowCount`](https://surveyjs.io/form-library/documentation/settings#matrixMaximumRowCount))
   * @see rowCount
   * @see minRowCount
   * @see allowAddRows
   */
  public get maxRowCount(): number {
    return this.getPropertyValue("maxRowCount");
  }
  public set maxRowCount(val: number) {
    if (val <= 0) return;
    if (val > settings.matrixMaximumRowCount)
      val = settings.matrixMaximumRowCount;
    if (val == this.maxRowCount) return;
    this.setPropertyValue("maxRowCount", val);
    if (val < this.minRowCount) this.minRowCount = val;
    if (this.rowCount > val) this.rowCount = val;
  }
  /**
   * Specifies whether users are allowed to add new rows.
   *
   * Default value: `true`
   * @see canAddRow
   * @see allowRemoveRows
   */
  public get allowAddRows(): boolean {
    return this.getPropertyValue("allowAddRows");
  }
  public set allowAddRows(val: boolean) {
    this.setPropertyValue("allowAddRows", val);
  }
  /**
   * Specifies whether users are allowed to delete rows.
   *
   * Default value: `true`
   * @see canRemoveRows
   * @see allowAddRows
   */
  public get allowRemoveRows(): boolean {
    return this.getPropertyValue("allowRemoveRows");
  }
  public set allowRemoveRows(val: boolean) {
    this.setPropertyValue("allowRemoveRows", val);
    if (!this.isUpdateLocked) {
      this.resetRenderedTable();
    }
  }
  /**
   * Indicates whether it is possible to add a new row.
   *
   * This property returns `true` when all of the following conditions apply:
   *
   * - Users are allowed to add new rows (`allowAddRows` is `true`).
   * - The question, its parent panel, or survey is not in read-only state.
   * - `rowCount` is less than `maxRowCount`.
   * @see allowAddRows
   * @see isReadOnly
   * @see rowCount
   * @see maxRowCount
   * @see canRemoveRows
   */
  public get canAddRow(): boolean {
    return (
      this.allowAddRows && !this.isReadOnly && this.rowCount < this.maxRowCount
    );
  }
  public canRemoveRowsCallback: (allow: boolean) => boolean;
  /**
   * Indicates whether it is possible to delete rows.
   *
   * This property returns `true` when all of the following conditions apply:
   *
   * - Users are allowed to delete rows (`allowRemoveRows` is `true`).
   * - The question, its parent panel, or survey is not in read-only state.
   * - `rowCount` exceeds `minRowCount`.
   * @see allowRemoveRows
   * @see isReadOnly
   * @see rowCount
   * @see minRowCount
   * @see canAddRow
   */
  public get canRemoveRows(): boolean {
    var res =
      this.allowRemoveRows &&
      !this.isReadOnly &&
      this.rowCount > this.minRowCount;
    return !!this.canRemoveRowsCallback ? this.canRemoveRowsCallback(res) : res;
  }
  public canRemoveRow(row: MatrixDropdownRowModelBase): boolean {
    if (!this.survey) return true;
    return this.survey.matrixAllowRemoveRow(
      this,
      (<MatrixDynamicRowModel>row).index,
      row
    );
  }
  /**
   * Creates and add a new row and focus the cell in the first column.
   */
  public addRowUI(): void {
    this.addRow(true);
  }
  private getQuestionToFocusOnAddingRow(): Question {
    var row = this.visibleRows[this.visibleRows.length - 1];
    for (var i = 0; i < row.cells.length; i++) {
      var q = row.cells[i].question;
      if (!!q && q.isVisible && !q.isReadOnly) {
        return q;
      }
    }
    return null;
  }
  /**
   * Creates and add a new row. Optionally focus the cell in the first column.
   * @param setFocus set this parameter to true to focus the cell in the first column.
   */
  public addRow(setFocus?: boolean): void {
    const oldRowCount = this.rowCount;
    var options = { question: this, canAddRow: this.canAddRow };
    if (!!this.survey) {
      this.survey.matrixBeforeRowAdded(options);
    }
    if (!options.canAddRow) return;
    this.onStartRowAddingRemoving();
    this.addRowCore();
    this.onEndRowAdding();
    if (this.detailPanelShowOnAdding && this.visibleRows.length > 0) {
      this.visibleRows[this.visibleRows.length - 1].showDetailPanel();
    }
    if (setFocus && oldRowCount !== this.rowCount) {
      const q = this.getQuestionToFocusOnAddingRow();
      if (!!q) {
        q.focus();
      }
    }
  }
  /**
   * Specifies whether to expand the detail section immediately when a respondent adds a new row.
   * @see detailPanelMode
   */
  public get detailPanelShowOnAdding(): boolean {
    return this.getPropertyValue("detailPanelShowOnAdding");
  }
  public set detailPanelShowOnAdding(val: boolean) {
    this.setPropertyValue("detailPanelShowOnAdding", val);
  }
  protected hasRowsAsItems(): boolean {
    return false;
  }
  public unbindValue() {
    this.clearGeneratedRows();
    this.clearPropertyValue("value");
    this.rowCountValue = 0;
    super.unbindValue();
  }
  protected isValueSurveyElement(val: any): boolean {
    return this.isEditingSurveyElement || super.isValueSurveyElement(val);
  }
  private addRowCore() {
    var prevRowCount = this.rowCount;
    this.rowCount = this.rowCount + 1;
    var defaultValue = this.getDefaultRowValue(true);
    var newValue = null;
    if (!this.isValueEmpty(defaultValue)) {
      newValue = this.createNewValue();
      if (newValue.length == this.rowCount) {
        newValue[newValue.length - 1] = defaultValue;
        this.value = newValue;
      }
    }
    if (this.data) {
      this.runCellsCondition(
        this.getDataFilteredValues(),
        this.getDataFilteredProperties()
      );
      if(this.isValueEmpty(defaultValue)) {
        const row = this.visibleRows[this.rowCount - 1];
        if (!this.isValueEmpty(row.value)) {
          if (!newValue) {
            newValue = this.createNewValue();
          }
          if (
            !this.isValueSurveyElement(newValue) &&
            !this.isTwoValueEquals(newValue[newValue.length - 1], row.value)
          ) {
            newValue[newValue.length - 1] = row.value;
            this.value = newValue;
          }
        }
      }
    }
    if (this.survey) {
      if (prevRowCount + 1 == this.rowCount) {
        this.survey.matrixRowAdded(
          this,
          this.visibleRows[this.visibleRows.length - 1]
        );
        this.onRowsChanged();
      }
    }
  }
  private getDefaultRowValue(isRowAdded: boolean): any {
    var res = null;
    for (var i = 0; i < this.columns.length; i++) {
      var q = this.columns[i].templateQuestion;
      if (!!q && !this.isValueEmpty(q.getDefaultValue())) {
        res = res || {};
        (<any>res)[this.columns[i].name] = q.getDefaultValue();
      }
    }
    if (!this.isValueEmpty(this.defaultRowValue)) {
      for (var key in this.defaultRowValue) {
        res = res || {};
        (<any>res)[key] = this.defaultRowValue[key];
      }
    }
    if (isRowAdded && this.defaultValueFromLastRow) {
      var val = this.value;
      if (!!val && Array.isArray(val) && val.length >= this.rowCount - 1) {
        var rowValue = val[this.rowCount - 2];
        for (var key in rowValue) {
          res = res || {};
          (<any>res)[key] = rowValue[key];
        }
      }
    }
    return res;
  }
  /**
   * Removes a row by it's index. If confirmDelete is true, show a confirmation dialog
   * @param index a row index, from 0 to rowCount - 1
   * @see removeRow
   * @see confirmDelete
   */
  public removeRowUI(value: any) {
    if (!!value && !!value.rowName) {
      var index = this.visibleRows.indexOf(value);
      if (index < 0) return;
      value = index;
    }
    this.removeRow(value, this.isRequireConfirmOnRowDelete(index));
  }
  public isRequireConfirmOnRowDelete(index: number): boolean {
    if (!this.confirmDelete) return false;
    if (index < 0 || index >= this.rowCount) return false;
    var value = this.createNewValue();
    if (this.isValueEmpty(value) || !Array.isArray(value)) return false;
    if (index >= value.length) return false;
    return !this.isValueEmpty(value[index]);
  }
  /**
   * Removes a row by it's index.
   * @param index a row index, from 0 to rowCount - 1
   * @param confirmDelete set this parameter to true to show a confirmation dialog
   */
  public removeRow(index: number, confirmDelete?: boolean): void {
    if (!this.canRemoveRows) return;
    if (index < 0 || index >= this.rowCount) return;
    var row =
      !!this.visibleRows && index < this.visibleRows.length
        ? this.visibleRows[index]
        : null;
    if (confirmDelete && !confirmAction(this.confirmDeleteText)) return;
    if (!!row && !!this.survey && !this.survey.matrixRowRemoving(this, index, row)) return;
    this.onStartRowAddingRemoving();
    this.removeRowCore(index);
    this.onEndRowRemoving(row);
  }
  private removeRowCore(index: number) {
    var row = this.generatedVisibleRows
      ? this.generatedVisibleRows[index]
      : null;
    if (this.generatedVisibleRows && index < this.generatedVisibleRows.length) {
      this.generatedVisibleRows.splice(index, 1);
    }
    this.rowCountValue--;
    if (this.value) {
      var val = [];
      if (Array.isArray(this.value) && index < this.value.length) {
        val = this.createValueCopy();
      } else {
        val = this.createNewValue();
      }
      val.splice(index, 1);
      val = this.deleteRowValue(val, null);
      this.isRowChanging = true;
      this.value = val;
      this.isRowChanging = false;
    }
    this.onRowsChanged();
    if (this.survey) {
      this.survey.matrixRowRemoved(this, index, row);
    }
  }
  /**
   * A message displayed in a confirmation dialog that appears when a respondent wants to delete a row.
   * @see confirmDelete
   */
  public get confirmDeleteText() {
    return this.getLocalizableStringText("confirmDeleteText");
  }
  public set confirmDeleteText(val: string) {
    this.setLocalizableStringText("confirmDeleteText", val);
  }
  get locConfirmDeleteText() {
    return this.getLocalizableString("confirmDeleteText");
  }
  /**
   * A caption for the Add Row button.
   * @see addRowLocation
   */
  public get addRowText() {
    return this.getLocalizableStringText("addRowText", this.defaultAddRowText);
  }
  public set addRowText(val: string) {
    this.setLocalizableStringText("addRowText", val);
  }
  get locAddRowText() {
    return this.getLocalizableString("addRowText");
  }
  private get defaultAddRowText(): string {
    return this.getLocalizationString(
      this.isColumnLayoutHorizontal ? "addRow" : "addColumn"
    );
  }
  /**
   * Specifies the location of the Add Row button.
   *
   * Possible values:
   *
   * - `"top"` - Displays the Add Row button at the top of the matrix.
   * - `"bottom"` - Displays the Add Row button at the bottom of the matrix.
   * - `"topBottom"` - Displays the Add Row button at the top and bottom of the matrix.
   *
   * Default value: `"top"` if `columnLayout` is `vertical`; `"bottom"` if `columnLayout` is `"horizontal"` or the matrix is in compact mode.
   * @see columnLayout
   * @see addRowText
   */
  public get addRowLocation(): string {
    return this.getPropertyValue("addRowLocation");
  }
  public set addRowLocation(val: string) {
    this.setPropertyValue("addRowLocation", val);
  }
  public getAddRowLocation(): string {
    return this.addRowLocation;
  }
  /**
   * Specifies whether to hide columns when the matrix does not contain any rows. If you enable this property, the matrix displays the `emptyRowsText` message and the Add Row button.
   *
   * Default value: `false`
   * @see emptyRowsText
   */
  public get hideColumnsIfEmpty(): boolean {
    return this.getPropertyValue("hideColumnsIfEmpty");
  }
  public set hideColumnsIfEmpty(val: boolean) {
    this.setPropertyValue("hideColumnsIfEmpty", val);
  }
  public getShowColumnsIfEmpty() {
    return this.hideColumnsIfEmpty;
  }
  /**
   * Use this property to change the default value of remove row button text.
   */
  public get removeRowText() {
    return this.getLocalizableStringText("removeRowText");
  }
  public set removeRowText(val: string) {
    this.setLocalizableStringText("removeRowText", val);
  }
  get locRemoveRowText() {
    return this.getLocalizableString("removeRowText");
  }
  /**
   * A message displayed when the matrix does not contain any rows. Applies only if `hideColumnsIfEmpty` is enabled.
   * @see hideColumnsIfEmpty
   */
  public get emptyRowsText() {
    return this.getLocalizableStringText("emptyRowsText");
  }
  public set emptyRowsText(val: string) {
    this.setLocalizableStringText("emptyRowsText", val);
  }
  get locEmptyRowsText() {
    return this.getLocalizableString("emptyRowsText");
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value || !Array.isArray(value)) return value;
    var values = this.getUnbindValue(value);
    var rows = this.visibleRows;
    for (var i = 0; i < rows.length && i < values.length; i++) {
      var val = values[i];
      if (!val) continue;
      values[i] = this.getRowDisplayValue(keysAsText, rows[i], val);
    }
    return values;
  }
  protected getConditionObjectRowName(index: number): string {
    return "[" + index.toString() + "]";
  }
  protected getConditionObjectsRowIndeces() : Array<number> {
    const res = [];
    const rowCount = Math.max(this.rowCount, 1);
    for (var i = 0; i < Math.min(settings.matrixMaxRowCountInCondition, rowCount); i++) {
      res.push(i);
    }
    return res;
  }
  public supportGoNextPageAutomatic() {
    return false;
  }
  public get hasRowText(): boolean {
    return false;
  }
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (!isOnValueChanged && this.hasErrorInMinRows()) {
      errors.push(new MinRowCountError(this.minRowCount, this));
    }
  }
  private hasErrorInMinRows(): boolean {
    if (this.minRowCount <= 0 || !this.isRequired || !this.generatedVisibleRows)
      return false;
    var setRowCount = 0;
    for (
      var rowIndex = 0;
      rowIndex < this.generatedVisibleRows.length;
      rowIndex++
    ) {
      var row = this.generatedVisibleRows[rowIndex];
      if (!row.isEmpty) setRowCount++;
    }
    return setRowCount < this.minRowCount;
  }
  protected getUniqueColumns(): Array<MatrixDropdownColumn> {
    var res = super.getUniqueColumns();
    if (!!this.keyName) {
      let column = this.getColumnByName(this.keyName);
      if (!!column && res.indexOf(column) < 0) {
        res.push(column);
      }
    }
    return res;
  }
  protected generateRows(): Array<MatrixDynamicRowModel> {
    var result = new Array<MatrixDynamicRowModel>();
    if (this.rowCount === 0) return result;
    var val = this.createNewValue();
    for (var i = 0; i < this.rowCount; i++) {
      result.push(this.createMatrixRow(this.getRowValueByIndex(val, i)));
    }
    if (!this.isValueEmpty(this.getDefaultRowValue(false))) {
      this.value = val;
    }
    return result;
  }
  protected createMatrixRow(value: any): MatrixDynamicRowModel {
    return new MatrixDynamicRowModel(this.rowCounter++, this, value);
  }
  protected onBeforeValueChanged(val: any) {
    if (!val || !Array.isArray(val)) return;
    var newRowCount = val.length;
    if (newRowCount == this.rowCount) return;
    if (!this.setRowCountValueFromData && newRowCount < this.initialRowCount)
      return;
    this.setRowCountValueFromData = true;
    this.rowCountValue = newRowCount;
    if (this.generatedVisibleRows) {
      this.clearGeneratedRows();
      this.generatedVisibleRows = this.visibleRows;
      this.onRowsChanged();
    }
  }
  protected createNewValue(): any {
    var result = this.createValueCopy();
    if (!result || !Array.isArray(result)) result = [];
    if (result.length > this.rowCount) result.splice(this.rowCount);
    var rowValue = this.getDefaultRowValue(false);
    rowValue = rowValue || {};
    for (var i = result.length; i < this.rowCount; i++) {
      result.push(this.getUnbindValue(rowValue));
    }
    return result;
  }
  protected deleteRowValue(
    newValue: any,
    row: MatrixDropdownRowModelBase
  ): any {
    var isEmpty = true;
    for (var i = 0; i < newValue.length; i++) {
      if (this.isObject(newValue[i]) && Object.keys(newValue[i]).length > 0) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty ? null : newValue;
  }

  private getRowValueByIndex(questionValue: any, index: number): any {
    return Array.isArray(questionValue) &&
      index >= 0 &&
      index < questionValue.length
      ? questionValue[index]
      : null;
  }
  protected getRowValueCore(
    row: MatrixDropdownRowModelBase,
    questionValue: any,
    create: boolean = false
  ): any {
    if (!this.generatedVisibleRows) return {};
    var res = this.getRowValueByIndex(
      questionValue,
      this.generatedVisibleRows.indexOf(row)
    );
    if (!res && create) res = {};
    return res;
  }
  public getAddRowButtonCss(isEmptySection: boolean = false): string {
    return new CssClassBuilder()
      .append(this.cssClasses.button)
      .append(this.cssClasses.buttonAdd)
      .append(this.cssClasses.emptyRowsButton, isEmptySection)
      .toString();
  }
  public getRemoveRowButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.button)
      .append(this.cssClasses.buttonRemove)
      .toString();
  }
  public getRootCss(): string {
    return new CssClassBuilder().append(super.getRootCss()).append(this.cssClasses.empty, !this.renderedTable?.showTable).toString();
  }
}

class QuestionMatrixDynamicRenderedTable extends QuestionMatrixDropdownRenderedTable {
  protected setDefaultRowActions(
    row: MatrixDropdownRowModelBase,
    actions: Array<IAction>
  ) {
    super.setDefaultRowActions(row, actions);
  }
}

Serializer.addClass(
  "matrixdynamic",
  [
    { name: "rowsVisibleIf:condition", visible: false },
    { name: "allowAddRows:boolean", default: true },
    { name: "allowRemoveRows:boolean", default: true },
    { name: "rowCount:number", default: 2, minValue: 0, isBindable: true },
    { name: "minRowCount:number", default: 0, minValue: 0 },
    {
      name: "maxRowCount:number",
      default: settings.matrixMaximumRowCount,
    },
    { name: "keyName" },
    "defaultRowValue:rowvalue",
    "defaultValueFromLastRow:boolean",
    { name: "confirmDelete:boolean" },
    {
      name: "confirmDeleteText",
      dependsOn: "confirmDelete",
      visibleIf: function(obj: any): boolean {
        return !obj || obj.confirmDelete;
      },
      serializationProperty: "locConfirmDeleteText",
    },
    {
      name: "addRowLocation",
      default: "default",
      choices: ["default", "top", "bottom", "topBottom"],
    },
    { name: "addRowText", serializationProperty: "locAddRowText" },
    { name: "removeRowText", serializationProperty: "locRemoveRowText" },
    "hideColumnsIfEmpty:boolean",
    {
      name: "emptyRowsText:text",
      serializationProperty: "locEmptyRowsText",
      dependsOn: "hideColumnsIfEmpty",
      visibleIf: function(obj: any): boolean {
        return !obj || obj.hideColumnsIfEmpty;
      },
    },
    {
      name: "detailPanelShowOnAdding:boolean",
      dependsOn: "detailPanelMode",
      visibleIf: function(obj: any): boolean {
        return obj.detailPanelMode !== "none";
      },
    },
    "allowRowsDragAndDrop:switch"
  ],
  function() {
    return new QuestionMatrixDynamicModel("");
  },
  "matrixdropdownbase"
);

QuestionFactory.Instance.registerQuestion("matrixdynamic", (name) => {
  var q = new QuestionMatrixDynamicModel(name);
  q.choices = [1, 2, 3, 4, 5];
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
