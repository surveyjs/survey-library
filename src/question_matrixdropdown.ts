import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownRowModelBase,
  IMatrixDropdownData,
} from "./question_matrixdropdownbase";
import { Serializer } from "./jsonobject";
import { ItemValue } from "./itemvalue";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { IProgressInfo } from "./base-interfaces";

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
  public get text(): string {
    return this.item.text;
  }
  public get locText(): LocalizableString {
    return this.item.locText;
  }
}
/**
 * A Model for a matrix dropdown question. You may use a dropdown, checkbox, radiogroup, text and comment questions as a cell editors.
 */
export class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase
  implements IMatrixDropdownData {
  constructor(name: string) {
    super(name);
    this.createLocalizableString("totalText", this, true);
    this.registerFunctionOnPropertyValueChanged("rows", () => {
      this.clearGeneratedRows();
      this.resetRenderedTable();
      if (!this.filterItems()) {
        this.onRowsChanged();
      }
    });
    this.registerFunctionOnPropertyValueChanged("hideIfRowsEmpty", () => {
      this.updateVisibilityBasedOnRows();
    });
  }
  public getType(): string {
    return "matrixdropdown";
  }
  /**
   * Set this property to show it on the first column for the total row.
   */
  public get totalText() {
    return this.getLocalizableStringText("totalText", "");
  }
  public set totalText(val: string) {
    this.setLocalizableStringText("totalText", val);
  }
  public get locTotalText(): LocalizableString {
    return this.getLocalizableString("totalText");
  }
  public getFooterText(): LocalizableString {
    return this.locTotalText;
  }
  /**
   * The column width for the first column, row title column.
   */
  public get rowTitleWidth(): string {
    return this.getPropertyValue("rowTitleWidth", "");
  }
  public set rowTitleWidth(val: string) {
    this.setPropertyValue("rowTitleWidth", val);
  }
  public getRowTitleWidth(): string {
    return this.rowTitleWidth;
  }
  /**
   * Set this property to true to hide the question if there is no visible rows in the matrix.
   */
  public get hideIfRowsEmpty(): boolean {
    return this.getPropertyValue("hideIfRowsEmpty", false);
  }
  public set hideIfRowsEmpty(val: boolean) {
    this.setPropertyValue("hideIfRowsEmpty", val);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value) return value;
    var rows = this.visibleRows;
    var res = {};
    if (!rows) return res;
    for (var i = 0; i < rows.length; i++) {
      var rowValue = rows[i].rowName;
      var val = value[rowValue];
      if (!val) continue;
      if (keysAsText) {
        var displayRowValue = ItemValue.getTextOrHtmlByValue(
          this.rows,
          rowValue
        );
        if (!!displayRowValue) {
          rowValue = displayRowValue;
        }
      }
      (<any>res)[rowValue] = this.getRowDisplayValue(keysAsText, rows[i], val);
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
  protected setNewValue(newValue: any): void {
    if(!!newValue && typeof newValue !== "object") return;
    super.setNewValue(newValue);
  }
  public clearIncorrectValues() {
    var val = this.value;
    if (!val) return;
    var newVal = null;
    var isChanged = false;
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    for (var key in val) {
      if (ItemValue.getItemByValue(rows, key)) {
        if (newVal == null) newVal = {};
        (<any>newVal)[key] = val[key];
      } else {
        isChanged = true;
      }
    }
    if (isChanged) {
      this.value = newVal;
    }
    super.clearIncorrectValues();
  }
  protected clearValueIfInvisibleCore(): void {
    super.clearValueIfInvisibleCore();
    this.clearInvisibleValuesInRows();
  }
  protected generateRows(): Array<MatrixDropdownRowModel> {
    var result = new Array<MatrixDropdownRowModel>();
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    if (!rows || rows.length === 0) return result;
    var val = this.value;
    if (!val) val = {};
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].value) continue;
      result.push(this.createMatrixRow(rows[i], val[rows[i].value]));
    }
    return result;
  }
  protected createMatrixRow(
    item: ItemValue,
    value: any
  ): MatrixDropdownRowModel {
    return new MatrixDropdownRowModel(item.value, item, this, value);
  }
  protected getSearchableItemValueKeys(keys: Array<string>) {
    keys.push("rows");
  }
  protected updateProgressInfoByValues(res: IProgressInfo): void {
    let val = this.value;
    if(!val) val = {};
    for(var i = 0; i < this.rows.length; i ++) {
      const row = this.rows[i];
      const rowValue = val[row.value];
      this.updateProgressInfoByRow(res, !!rowValue ? rowValue : {});
    }
  }
}

Serializer.addClass(
  "matrixdropdown",
  [
    {
      name: "rows:itemvalue[]",
    },
    "rowsVisibleIf:condition",
    "rowTitleWidth",
    { name: "totalText", serializationProperty: "locTotalText" },
    "hideIfRowsEmpty:boolean"
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
