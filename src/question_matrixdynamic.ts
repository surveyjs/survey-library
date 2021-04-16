import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData,
  MatrixDropdownColumn,
} from "./question_matrixdropdownbase";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { surveyLocalization } from "./surveyStrings";
import { Base, SurveyError } from "./base";
import { MinRowCountError, KeyDuplicationError } from "./error";
import { IConditionObject } from "./question";
import { Helpers } from "./helpers";
import { settings } from "./settings";
import { confirmAction } from "./utils/utils";
import { LocalizableString } from "./localizablestring";

export class MatrixDynamicRowModel extends MatrixDropdownRowModelBase {
  constructor(public index: number, data: IMatrixDropdownData, value: any) {
    super(data, value);
    this.buildCells(value);
  }
  public get rowName() {
    return this.id;
  }
}

/**
 * A Model for a matrix dymanic question. You may use a dropdown, checkbox, radiogroup, text and comment questions as a cell editors.
 * An end-user may dynamically add/remove rows, unlike in matrix dropdown question.
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
    void (<LocalizableString>(
      this.createLocalizableString("confirmDeleteText", this)
    ));
    void (<LocalizableString>this.createLocalizableString("addRowText", this));
    void (<LocalizableString>(
      this.createLocalizableString("removeRowText", this)
    ));
    var locEmptyRowsText = <LocalizableString>(
      this.createLocalizableString("emptyRowsText", this)
    );
    locEmptyRowsText.onGetTextCallback = (text: string): string => {
      return !!text ? text : surveyLocalization.getString("emptyRowsText");
    };
    this.registerFunctionOnPropertyValueChanged("hideColumnsIfEmpty", () => {
      this.setShowColumnsIfEmpty();
    });
  }
  public getType(): string {
    return "matrixdynamic";
  }
  public get isRowsDynamic(): boolean {
    return true;
  }
  /**
   * Set it to true, to show a confirmation dialog on removing a row
   * @see ConfirmDeleteText
   */
  public get confirmDelete(): boolean {
    return this.getPropertyValue("confirmDelete", false);
  }
  public set confirmDelete(val: boolean) {
    this.setPropertyValue("confirmDelete", val);
  }
  /**
   * Set it to a column name and the library shows duplication error, if there are same values in different rows in the column.
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
   * Set it to true to copy the value into new added row from the last row. If defaultRowValue is set and this property equals to true,
   * then the value for new added row is merging.
   * @see defaultValue
   * @see defaultRowValue
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
  protected isEditingSurveyElement(value: any): boolean {
    if (!!this.survey && this.survey.isEditingSurveyElement) return true;
    return super.isEditingSurveyElement(value);
  }
  /**
   * The number of rows in the matrix.
   * @see minRowCount
   * @see maxRowCount
   */
  public get rowCount(): number {
    return this.rowCountValue;
  }
  private get rowCountValue(): number {
    return this.getPropertyValue("rowCount", 2);
  }
  private set rowCountValue(val: number) {
    this.setPropertyValue("rowCount", val);
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
    if (this.isLoadingFromJson) {
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
    }
    this.onRowsChanged();
  }
  private getValueForNewRow(): any {
    var res = null;
    if (!!this.onGetValueForNewRowCallBack) {
      res = this.onGetValueForNewRowCallBack(this);
    }
    return res;
  }
  /**
   * The minimum row count. A user could not delete a row if the rowCount equals to minRowCount
   * @see rowCount
   * @see maxRowCount
   * @see allowAddRows
   */
  public get minRowCount(): number {
    return this.getPropertyValue("minRowCount", 0);
  }
  public set minRowCount(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("minRowCount", val);
    if (val > this.maxRowCount) this.maxRowCount = val;
    if (this.rowCount < val) this.rowCount = val;
  }
  /**
   * The maximum row count. A user could not add a row if the rowCount equals to maxRowCount
   * @see rowCount
   * @see minRowCount
   * @see allowAddRows
   */
  public get maxRowCount(): number {
    return this.getPropertyValue("maxRowCount", settings.matrixMaximumRowCount);
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
   * Set this property to false to disable ability to add new rows. "Add new Row" button becomes invsible in UI
   * @see canAddRow
   * @see allowRemoveRows
   */
  public get allowAddRows(): boolean {
    return this.getPropertyValue("allowAddRows", true);
  }
  public set allowAddRows(val: boolean) {
    this.setPropertyValue("allowAddRows", val);
  }
  /**
   * Set this property to false to disable ability to remove rows. "Remove" row buttons become invsible in UI
   * @see canRemoveRows
   * @see allowAddRows
   */
  public get allowRemoveRows(): boolean {
    return this.getPropertyValue("allowRemoveRows", true);
  }
  public set allowRemoveRows(val: boolean) {
    this.setPropertyValue("allowRemoveRows", val);
    if (!this.isLoadingFromJson) {
      this.resetRenderedTable();
    }
  }
  /**
   * Returns true, if a new row can be added.
   * @see allowAddRows
   * @see maxRowCount
   * @see canRemoveRows
   * @see rowCount
   */
  public get canAddRow(): boolean {
    return (
      this.allowAddRows && !this.isReadOnly && this.rowCount < this.maxRowCount
    );
  }
  /**
   * Returns true, if row can be removed.
   * @see minRowCount
   * @see canAddRow
   * @see rowCount
   */
  public get canRemoveRows(): boolean {
    return (
      this.allowRemoveRows &&
      !this.isReadOnly &&
      this.rowCount > this.minRowCount
    );
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
   * Creates and add a new row.
   */
  public addRow() {
    var options = { question: this, canAddRow: this.canAddRow };
    if (!!this.survey) {
      this.survey.matrixBeforeRowAdded(options);
    }
    if (!options.canAddRow) return;
    this.onStartRowAddingRemoving();
    this.addRowCore();
    this.onEndRowAdding();
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
      var row = this.visibleRows[this.rowCount - 1];
      if (!this.isValueEmpty(row.value)) {
        if (!newValue) {
          newValue = this.createNewValue();
        }
        if (
          !this.isEditingSurveyElement(newValue) &&
          !Helpers.isTwoValueEquals(newValue[newValue.length - 1], row.value)
        ) {
          newValue[newValue.length - 1] = row.value;
          this.value = newValue;
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
    if (
      !this.isRequireConfirmOnRowDelete(value) ||
      confirmAction(this.confirmDeleteText)
    ) {
      this.removeRow(value);
    }
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
   */
  public removeRow(index: number) {
    if (!this.canRemoveRows) return;
    if (index < 0 || index >= this.rowCount) return;
    var row =
      !!this.visibleRows && index < this.visibleRows.length
        ? this.visibleRows[index]
        : null;
    if (
      !!row &&
      !!this.survey &&
      !this.survey.matrixRowRemoving(this, index, row)
    )
      return;
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
   * Use this property to change the default text showing in the confirmation delete dialog on removing a row.
   */
  public get confirmDeleteText() {
    return this.getLocalizableStringText(
      "confirmDeleteText",
      surveyLocalization.getString("confirmDelete")
    );
  }
  public set confirmDeleteText(val: string) {
    this.setLocalizableStringText("confirmDeleteText", val);
  }
  get locConfirmDeleteText() {
    return this.getLocalizableString("confirmDeleteText");
  }
  /**
   * Use this property to change the default value of add row button text.
   */
  public get addRowText() {
    var defaultLocName = this.isColumnLayoutHorizontal ? "addRow" : "addColumn";
    return this.getLocalizableStringText(
      "addRowText",
      surveyLocalization.getString(defaultLocName)
    );
  }
  public set addRowText(val: string) {
    this.setLocalizableStringText("addRowText", val);
  }
  get locAddRowText() {
    return this.getLocalizableString("addRowText");
  }
  /**
   * By default the 'Add Row' button is shown on bottom if columnLayout is horizontal and on top if columnLayout is vertical. <br/>
   * You may set it to "top", "bottom" or "topBottom" (to show on top and bottom).
   * @see columnLayout
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
   * Set this property to true to hide matrix columns when there is no any row.
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
    return this.getLocalizableStringText(
      "removeRowText",
      surveyLocalization.getString("removeRow")
    );
  }
  public set removeRowText(val: string) {
    this.setLocalizableStringText("removeRowText", val);
  }
  get locRemoveRowText() {
    return this.getLocalizableString("removeRowText");
  }
  /**
   * Use this property to change the default value of remove row button text.
   */
  public get emptyRowsText() {
    return this.getLocalizableStringText(
      "emptyRowsText",
      surveyLocalization.getString("emptyRowsText")
    );
  }
  public set emptyRowsText(val: string) {
    this.setLocalizableStringText("emptyRowsText", val);
  }
  get locEmptyRowsText() {
    return this.getLocalizableString("emptyRowsText");
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var values = this.createValueCopy();
    if (!values || !Array.isArray(values)) return values;
    var rows = this.visibleRows;
    for (var i = 0; i < rows.length && i < values.length; i++) {
      var val = values[i];
      if (!val) continue;
      values[i] = this.getRowDisplayValue(rows[i], val);
    }
    return values;
  }
  public addConditionObjectsByContext(
    objects: Array<IConditionObject>,
    context: any
  ) {
    var hasContext = !!context ? this.columns.indexOf(context) > -1 : false;
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      this.addColumnIntoaddConditionObjectsByContext(objects, 0, column);
      if (hasContext && column != context) {
        this.addColumnIntoaddConditionObjectsByContext(objects, -1, column);
      }
      for (
        var j = 1;
        j < Math.min(settings.matrixMaxRowCountInCondition, this.rowCount);
        j++
      ) {
        this.addColumnIntoaddConditionObjectsByContext(objects, j, column);
      }
    }
  }
  private addColumnIntoaddConditionObjectsByContext(
    objects: Array<IConditionObject>,
    rowIndex: number,
    column: MatrixDropdownColumn
  ) {
    var rowName = rowIndex > -1 ? "[" + rowIndex.toString() + "]." : "row.";
    objects.push({
      name:
        (rowIndex > -1 ? this.getValueName() + rowName : rowName) + column.name,
      text:
        (rowIndex > -1 ? this.processedTitle + rowName : rowName) +
        column.fullTitle,
      question: this,
    });
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
  ],
  function() {
    return new QuestionMatrixDynamicModel("");
  },
  "matrixdropdownbase"
);

QuestionFactory.Instance.registerQuestion("matrixdynamic", name => {
  var q = new QuestionMatrixDynamicModel(name);
  q.choices = [1, 2, 3, 4, 5];
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
