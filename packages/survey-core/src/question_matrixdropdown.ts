import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData,
} from "./question_matrixdropdownbase";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { ItemValue } from "./itemvalue";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { IProgressInfo } from "./base-interfaces";
import { HashTable, Helpers } from "./helpers";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, ValueGetterContextCore, VariableGetterContext } from "./conditions/conditionProcessValue";
import { ConditionRunner } from "./conditions/conditionRunner";
import { ArrayChanges, Base } from "./base";
import { MatrixDropdownBaseSingleInputBehavior } from "./question_matrixdropdownbase";
import { QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";

export class MatrixDropdownValueGetterContext extends ValueGetterContextCore {
  constructor (protected question: QuestionMatrixDropdownModel) {
    super();
  }
  public getObj(): Base { return this.question; }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (!this.question.isDesignMode && !params.createObjects && this.question.isEmpty() && path.length === 0) return { isFound: true, value: undefined };
    if (path.length > 0) {
      const res = super.getValue(params);
      if (res && res.isFound) return res;
    }
    return new VariableGetterContext(this.question.value).getValue(params);
  }
  getRootObj(): IObjectValueContext { return <any>this.question.data; }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const rows = this.question.visibleRows;
    name = name.toLocaleLowerCase();
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const itemName = row.rowName?.toString() || "";
      if (itemName.toLocaleLowerCase() === name) {
        res.isFound = true;
        res.obj = row;
        res.context = row.getValueGetterContext();
        return;
      }
    }
  }
}

export class MatrixDropdownRowModel extends MatrixDropdownRowModelBase {
  private item: ItemValue;
  constructor(
    public name: string,
    item: ItemValue,
    data: IMatrixDropdownData,
    value: any
  ) {
    super(data, value);
    this.item = item;
    this.buildCells(value);
  }
  public get rowName(): string {
    return this.name;
  }
  public get rowTitle(): any {
    return this.text;
  }
  public get text(): string {
    return this.item.text;
  }
  public get locText(): LocalizableString {
    return this.item.locText;
  }
  protected isItemVisible(): boolean { return this.item.isVisible; }
  public isRowEnabled(): boolean { return this.item.isEnabled; }
  protected isRowHasEnabledCondition(): boolean { return !!this.item.enableIf; }
  protected getRowsVisibleIfExpression(rowsVisibleIf: string): Array<string> {
    const res = super.getRowsVisibleIfExpression(rowsVisibleIf);
    if (this.item.visibleIf) {
      res.push(this.item.visibleIf);
    }
    return res;
  }
  protected runRowsEnableCondition(properties: HashTable<any>): void {
    if (this.item.enableIf) {
      this.item.enabled = new ConditionRunner(this.item.enableIf).runContext(this.getValueGetterContext(), properties);
    }
  }
}
/**
  * A class that describes the Multi-Select Matrix question type. Multi-Select Matrix allows you to use the [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Checkbox](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radiogroup](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Text](https://surveyjs.io/form-library/documentation/questiontextmodel), and [Comment](https://surveyjs.io/form-library/documentation/questioncommentmodel) question types as cell editors.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))
 */
export class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase
  implements IMatrixDropdownData {
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any, arrayChanges?: ArrayChanges): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "rows" && !!this.generatedVisibleRows) {
      if (!this.tryUpdateRowsIncrementally(arrayChanges)) {
        this.clearGeneratedRows();
        this.resetRenderedTable();
        this.getVisibleRows();
        this.clearIncorrectValues();
      }
    }
    if (name === "hideIfRowsEmpty") {
      this.updateVisibilityBasedOnRows();
    }
  }
  private tryUpdateRowsIncrementally(arrayChanges: ArrayChanges | undefined): boolean {
    if (!arrayChanges) return false;
    const itemsToAdd = arrayChanges.itemsToAdd || [];
    const deleteCount = arrayChanges.deleteCount || 0;
    if (itemsToAdd.length === 1 && deleteCount === 0) {
      return this.tryAddSingleRow(<ItemValue>itemsToAdd[0]);
    }
    if (itemsToAdd.length === 0 && deleteCount === 1) {
      return this.tryRemoveSingleRow();
    }
    return false;
  }
  private tryAddSingleRow(item: ItemValue): boolean {
    const insertIndex = this.getAddedRowIndex(item);
    if (insertIndex < 0) return false;
    const val = this.value || {};
    const newRow = this.createMatrixRow(item, this.getRowValueForCreation(val, item.value));
    this.generatedVisibleRows.splice(insertIndex, 0, newRow);
    newRow.visibleIndex = insertIndex;
    this.onMatrixRowCreated(newRow);
    this.finishIncrementalRowChange((table) => table.onAddedRow(newRow, insertIndex));
    return true;
  }
  private tryRemoveSingleRow(): boolean {
    const removeIndex = this.getRemovedRowIndex();
    if (removeIndex < 0) return false;
    const removedRow = this.generatedVisibleRows[removeIndex];
    if (!this.isDisposed) {
      this.defaultValuesInRows[removedRow.rowName] = removedRow.getNamesWithDefaultValues();
    }
    this.generatedVisibleRows.splice(removeIndex, 1);
    this.finishIncrementalRowChange((table) => table.onRemovedRow(removedRow));
    return true;
  }
  private getAddedRowIndex(item: ItemValue): number {
    if (!item || this.isValueEmpty(item.value)) return -1;
    if (!!this.getRowByKey(item.value)) return -1;
    const indexInRows = this.rows.indexOf(item);
    if (indexInRows < 0) return -1;
    let insertIndex = 0;
    for (let i = 0; i < indexInRows; i++) {
      if (!this.isValueEmpty(this.rows[i].value)) insertIndex++;
    }
    return insertIndex;
  }
  private getRemovedRowIndex(): number {
    const currentRowNames: { [key: string]: boolean } = {};
    for (let i = 0; i < this.rows.length; i++) {
      currentRowNames[this.rows[i].value] = true;
    }
    for (let i = 0; i < this.generatedVisibleRows.length; i++) {
      if (!currentRowNames[this.generatedVisibleRows[i].rowName]) return i;
    }
    return -1;
  }
  private finishIncrementalRowChange(updateRendered: (table: QuestionMatrixDropdownRenderedTable) => void): void {
    this.clearVisibleRows();
    if (this.isRendredTableCreated) {
      updateRendered(this.renderedTable);
    }
    this.clearIncorrectValues();
  }
  public getType(): string {
    return "matrixdropdown";
  }
  protected getAllChildren(): Base[] {
    return [
      ...super.getAllChildren(),
      ...this.columns,
      ...this.rows,
    ];
  }
  /**
   * A title for the total row. Applies if at least one column displays total values.
   * @see rowTitleWidth
   * @see columns
   */
  @property ({ localizable: { markdown: true } }) totalText: string;
  public getFooterText(): LocalizableString {
    return this.locTotalText;
  }
  public getRowTitleWidth(): string {
    return this.rowTitleWidth;
  }
  /**
   * Specifies whether to hide the question when the matrix has no visible rows.
   * @see rowsVisibleIf
   */
  @property() hideIfRowsEmpty: boolean;

  public getSingleInputTitleTemplate(): string { return "rowNameTemplateTitle"; }
  public getValueGetterContext(): IValueGetterContext {
    return new MatrixDropdownValueGetterContext(this);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value) return value;
    var rows = this.visibleRows;
    var res = {};
    if (!rows) return res;
    for (var i = 0; i < rows.length; i++) {
      var rowName = rows[i].rowName;
      var val = value[rowName];
      if (!val) continue;
      if (keysAsText) {
        var displayRowValue = ItemValue.getTextOrHtmlByValue(
          this.rows,
          rowName
        );
        if (!!displayRowValue) {
          rowName = displayRowValue;
        }
      }
      (<any>res)[rowName] = this.getRowDisplayValue(keysAsText, rows[i], val);
    }
    return res;
  }
  protected getConditionObjectRowName(index: number): string {
    return "." + this.rows[index].value;
  }
  protected getConditionObjectRowText(index: number): string {
    return "." + this.rows[index].calculatedText;
  }
  protected getConditionObjectsRowIndeces() : Array<number> {
    const res = [];
    for (var i = 0; i < this.rows.length; i++) res.push(i);
    return res;
  }
  protected isNewValueCorrect(val: any): boolean {
    return Helpers.isValueObject(val, true);
  }
  public clearIncorrectValues(): void {
    if (!this.isEmpty()) {
      this.getVisibleRows();
      const newVal: any = {};
      const val = this.value;
      for (let key in val) {
        const row = this.getRowByKey(key);
        if (!!row && row.isVisible) {
          newVal[key] = val[key];
        }
      }
      this.value = newVal;
    }
    super.clearIncorrectValues();
  }
  private getRowByKey(val: any): MatrixDropdownRowModelBase {
    const rows = this.generatedVisibleRows;
    if (!rows) return null;
    for (let i = 0; i < rows.length; i ++) {
      if (rows[i].rowName === val) return rows[i];
    }
    return null;
  }
  private defaultValuesInRows: any = {};
  protected clearGeneratedRows(): void {
    if (!this.generatedVisibleRows) return;
    if (!this.isDisposed) {
      this.generatedVisibleRows.forEach(row => {
        this.defaultValuesInRows[row.rowName] = row.getNamesWithDefaultValues();
      });
    }
    super.clearGeneratedRows();
  }
  private getRowValueForCreation(val: any, rowName: any): any {
    const res = val[rowName];
    if (!res) return res;
    const names = this.defaultValuesInRows[rowName];
    if (!Array.isArray(names) || names.length === 0) return res;
    names.forEach(name => {
      delete res[name];
    });
    return res;
  }
  protected generateRows(): Array<MatrixDropdownRowModel> {
    var result = new Array<MatrixDropdownRowModel>();
    var rows = this.rows;
    if (!rows || rows.length === 0) return result;
    var val = this.value;
    if (!val) val = {};
    for (var i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (this.isValueEmpty(row.value)) continue;
      result.push(this.createMatrixRow(row, this.getRowValueForCreation(val, row.value)));
    }
    return result;
  }
  protected createMatrixRow(item: ItemValue, value: any): MatrixDropdownRowModel {
    return new MatrixDropdownRowModel(item.value, item, this, value);
  }
  protected getFilteredDataCore(): any {
    const res: any = {};
    this.generatedVisibleRows.forEach(row => {
      if (row.isVisible && !row.isEmpty) {
        res[row.rowName] = row.filteredValue;
      }
    });
    return res;
  }
  protected getSearchableItemValueKeys(keys: Array<string>) {
    keys.push("rows");
  }
  protected getIsRequireToGenerateRows(): boolean {
    if (super.getIsRequireToGenerateRows()) return true;
    for (let i = 0; i < this.rows.length; i ++) {
      if (!!this.rows[i].visibleIf) return true;
    }
    return false;
  }
  protected updateProgressInfoByValues(res: IProgressInfo): void {
    let val = this.value;
    if (!val) val = {};
    for (var i = 0; i < this.rows.length; i ++) {
      const row = this.rows[i];
      const rowName = val[row.value];
      this.updateProgressInfoByRow(res, !!rowName ? rowName : {});
    }
  }

  /**
   * Specifies a sort order for matrix rows.
   *
   * Possible values:
   *
   * - `"initial"` (default) - Preserves the original order of the `rows` array.
   * - `"random"` - Arranges matrix rows in random order each time the question is displayed.
   * @see rows
   */
  @property({ isLowerCase: true }) rowOrder: string;

  protected sortVisibleRows(array: Array<MatrixDropdownRowModel>): Array<MatrixDropdownRowModel> {
    if (!!this.survey && this.survey.isDesignMode) return array;
    if (this.rowOrder.toLowerCase() === "random") return Helpers.randomizeArray<MatrixDropdownRowModel>(array, this.randomSeed);
    return array;
  }

  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    this.rows = this.sortVisibleRows(this.rows);
  }

  public randomSeedChanged(): void {
    if (this.rowOrder.toLowerCase() !== "random") return;
    this.rows = this.sortVisibleRows(this.rows);
    this.clearGeneratedRows();
    this.resetRenderedTable();
    super.randomSeedChanged();
  }
}

Serializer.addClass(
  "matrixdropdown",
  [
    {
      name: "rows:itemvalue[]", uniqueProperty: "value"
    },
    "rowsVisibleIf:condition",
    "rowTitleWidth",
    { name: "totalText", serializationProperty: "locTotalText" },
    "hideIfRowsEmpty:boolean",
    {
      name: "rowOrder",
      default: "initial",
      choices: ["initial", "random"],
    }
  ],
  function() {
    return new QuestionMatrixDropdownModel("");
  },
  "matrixdropdownbase"
);

QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => {
  var q = new QuestionMatrixDropdownModel(name);
  q.choices = [1, 2, 3, 4, 5];
  q.rows = QuestionFactory.DefaultRows;
  QuestionMatrixDropdownModelBase.addDefaultColumns(q);
  return q;
});
