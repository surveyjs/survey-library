import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData,
  MatrixDropdownColumn
} from "./question_matrixdropdownbase";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { surveyLocalization } from "./surveyStrings";
import { Base, SurveyError } from "./base";
import { CustomError } from "./error";
import { LocalizableString } from "./localizablestring";
import { Helpers } from "./helpers";

export class MatrixDynamicRowModel extends MatrixDropdownRowModelBase {
  constructor(public index: number, data: IMatrixDropdownData, value: any) {
    super(data, value);
    this.buildCells();
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
  public static MaxRowCount = 100;
  private rowCounter = 0;
  private rowCountValue: number = 2;

  constructor(public name: string) {
    super(name);
    this.createLocalizableString("confirmDeleteText", this);
    this.createLocalizableString("keyDuplicationError", this);
    this.createLocalizableString("addRowText", this);
    this.createLocalizableString("removeRowText", this);
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
  /**
   * The number of rows in the matrix.
   * @see minRowCount
   * @see maxRowCount
   */
  public get rowCount(): number {
    return this.rowCountValue;
  }
  public set rowCount(val: number) {
    if (val < 0 || val > QuestionMatrixDynamicModel.MaxRowCount) return;
    var prevValue = this.rowCountValue;
    this.rowCountValue = val;
    if (this.value && this.value.length > val) {
      var qVal = this.value;
      qVal.splice(val);
      this.value = qVal;
    }
    if (this.isLoadingFromJson) return;
    if (this.generatedVisibleRows) {
      this.generatedVisibleRows.splice(val);
      for (var i = prevValue; i < val; i++) {
        var newRow = this.createMatrixRow(null);
        this.generatedVisibleRows.push(newRow);
        this.onMatrixRowCreated(newRow);
      }
    }
    this.fireCallback(this.visibleRowsChangedCallback);
  }
  /**
   * The minimum row count. A user could not delete a row if the rowCount equals to minRowCount
   * @see rowCount
   * @see maxRowCount
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
   */
  public get maxRowCount(): number {
    return this.getPropertyValue(
      "maxRowCount",
      QuestionMatrixDynamicModel.MaxRowCount
    );
  }
  public set maxRowCount(val: number) {
    if (val <= 0) return;
    if (val > QuestionMatrixDynamicModel.MaxRowCount)
      val = QuestionMatrixDynamicModel.MaxRowCount;
    if (val == this.maxRowCount) return;
    this.setPropertyValue("maxRowCount", val);
    if (val < this.minRowCount) this.minRowCount = val;
    if (this.rowCount > val) this.rowCount = val;
  }
  /**
   * Returns true, if a new row can be added.
   * @see maxRowCount
   * @see canRemoveRow
   * @see rowCount
   */
  public get canAddRow(): boolean {
    return !this.isReadOnly && this.rowCount < this.maxRowCount;
  }
  /**
   * Returns true, if a row can be removed.
   * @see minRowCount
   * @see canAddRow
   * @see rowCount
   */
  public get canRemoveRow(): boolean {
    return !this.isReadOnly && this.rowCount > this.minRowCount;
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
    var prevRowCount = this.rowCount;
    this.rowCount = this.rowCount + 1;
    var defaultValue = this.getDefaultRowValue(true);
    if (!this.isValueEmpty(defaultValue)) {
      var newValue = this.createNewValue(this.value);
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
    }
    if (this.survey) {
      if (prevRowCount + 1 == this.rowCount) {
        this.survey.matrixRowAdded(this);
        this.fireCallback(this.visibleRowsChangedCallback);
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
    if (!this.confirmDelete || confirm(this.confirmDeleteText)) {
      this.removeRow(value);
    }
  }
  /**
   * Removes a row by it's index.
   * @param index a row index, from 0 to rowCount - 1
   */
  public removeRow(index: number) {
    if (!this.canRemoveRow) return;
    if (index < 0 || index >= this.rowCount) return;
    if (this.survey) {
      var row = this.generatedVisibleRows
        ? this.generatedVisibleRows[index]
        : null;
      this.survey.matrixRowRemoved(this, index, row);
    }
    if (this.generatedVisibleRows && index < this.generatedVisibleRows.length) {
      this.generatedVisibleRows.splice(index, 1);
    }
    if (this.value) {
      var val = this.createNewValue(this.value);
      val.splice(index, 1);
      val = this.deleteRowValue(val, null);
      this.value = val;
    }
    this.rowCountValue--;
    this.fireCallback(this.visibleRowsChangedCallback);
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
   * The duplication value error text. Set it to show the text different from the default.
   * @see keyName
   */
  public get keyDuplicationError() {
    return this.getLocalizableStringText(
      "keyDuplicationError",
      surveyLocalization.getString("keyDuplicationError")
    );
  }
  public set keyDuplicationError(val: string) {
    this.setLocalizableStringText("keyDuplicationError", val);
  }
  get locKeyDuplicationError() {
    return this.getLocalizableString("keyDuplicationError");
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
    return this.getPropertyValue("addRowLocation", "default");
  }
  public set addRowLocation(val: string) {
    this.setPropertyValue("addRowLocation", val);
  }
  public get isAddRowOnTop() {
    if (!this.canAddRow) return false;
    if (this.addRowLocation === "default")
      return this.columnLayout === "vertical";
    return this.addRowLocation !== "bottom";
  }
  public get isAddRowOnBottom() {
    if (!this.canAddRow) return false;
    if (this.addRowLocation === "default")
      return this.columnLayout === "horizontal";
    return this.addRowLocation !== "top";
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
  protected getDisplayValueCore(keysAsText: boolean): any {
    var values = this.value;
    if (!values) return values;
    var rows = this.visibleRows;
    for (var i = 0; i < rows.length && i < values.length; i++) {
      var val = values[i];
      if (!val) continue;
      values[i] = this.getRowDisplayValue(rows[i], val);
    }
    return values;
  }
  public addConditionNames(names: Array<string>) {
    for (var i = 0; i < this.columns.length; i++) {
      names.push(this.name + "[0]." + this.columns[i].name);
    }
  }
  public supportGoNextPageAutomatic() {
    return false;
  }
  protected onCheckForErrors(errors: Array<SurveyError>) {
    super.onCheckForErrors(errors);
    if (this.hasErrorInRows()) {
      errors.push(
        new CustomError(
          surveyLocalization
            .getString("minRowCountError")
            ["format"](this.minRowCount)
        )
      );
    }
  }
  public hasErrors(fireCallback: boolean = true): boolean {
    var prevValue = super.hasErrors(fireCallback);
    return this.isValueDuplicated() || prevValue;
  }
  private hasErrorInRows(): boolean {
    if (this.minRowCount <= 0 || !this.generatedVisibleRows) return false;
    var res = false;
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
  private isValueDuplicated(): boolean {
    if (!this.keyName || !this.generatedVisibleRows) return false;
    var column = this.getColumnByName(this.keyName);
    if (!column) return false;
    var keyValues = <Array<any>>[];
    var res = false;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      res =
        this.isValueDuplicatedInRow(
          this.generatedVisibleRows[i],
          column,
          keyValues
        ) || res;
    }
    return res;
  }
  private isValueDuplicatedInRow(
    row: MatrixDropdownRowModelBase,
    column: MatrixDropdownColumn,
    keyValues: Array<any>
  ): boolean {
    var question = row.getQuestionByColumn(column);
    if (!question || question.isEmpty()) return false;
    var value = question.value;
    for (var i = 0; i < keyValues.length; i++) {
      if (value == keyValues[i]) {
        question.addError(new CustomError(this.keyDuplicationError, this));
        return true;
      }
    }
    keyValues.push(value);
    return false;
  }
  protected generateRows(): Array<MatrixDynamicRowModel> {
    var result = new Array<MatrixDynamicRowModel>();
    if (this.rowCount === 0) return result;
    var val = this.createNewValue(this.value);
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
    var newRowCount = val && Array.isArray(val) ? val.length : 0;
    if (newRowCount <= this.rowCount) return;
    this.rowCountValue = newRowCount;
    if (this.generatedVisibleRows) {
      this.generatedVisibleRows = null;
      this.generatedVisibleRows = this.visibleRows;
    }
  }
  protected createNewValue(curValue: any): any {
    var result = curValue;
    if (!result || !Array.isArray(result)) result = [];
    var r = [];
    if (result.length > this.rowCount) result.splice(this.rowCount - 1);
    var rowValue = this.getDefaultRowValue(false);
    rowValue = rowValue || {};
    for (var i = result.length; i < this.rowCount; i++) {
      result.push(Helpers.getUnbindValue(rowValue));
    }
    return result;
  }
  protected deleteRowValue(
    newValue: any,
    row: MatrixDropdownRowModelBase
  ): any {
    var isEmpty = true;
    for (var i = 0; i < newValue.length; i++) {
      if (Object.keys(newValue[i]).length > 0) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty ? null : newValue;
  }

  private getRowValueByIndex(questionValue: any, index: number): any {
    return index >= 0 && index < questionValue.length
      ? questionValue[index]
      : null;
  }
  protected getRowValueCore(
    row: MatrixDropdownRowModelBase,
    questionValue: any,
    create: boolean = false
  ): any {
    if (!this.generatedVisibleRows) return {};
    return this.getRowValueByIndex(
      questionValue,
      this.generatedVisibleRows.indexOf(row)
    );
  }
}

JsonObject.metaData.addClass(
  "matrixdynamic",
  [
    { name: "rowCount:number", default: 2 },
    { name: "minRowCount:number", default: 0 },
    {
      name: "maxRowCount:number",
      default: QuestionMatrixDynamicModel.MaxRowCount
    },
    { name: "keyName" },
    {
      name: "keyDuplicationError",
      serializationProperty: "locKeyDuplicationError"
    },
    "defaultRowValue:rowvalue",
    "defaultValueFromLastRow:boolean",
    { name: "confirmDelete:boolean" },
    {
      name: "confirmDeleteText",
      serializationProperty: "locConfirmDeleteText"
    },
    {
      name: "addRowLocation",
      default: "default",
      choices: ["default", "top", "bottom", "topBottom"]
    },
    { name: "addRowText", serializationProperty: "locAddRowText" },
    { name: "removeRowText", serializationProperty: "locRemoveRowText" }
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
