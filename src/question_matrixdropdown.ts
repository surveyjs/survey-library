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
import { Helpers } from "./helpers";

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
  * A class that describes the Multi-Select Matrix question type. Multi-Select Matrix allows you to use the [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Checkbox](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radiogroup](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Text](https://surveyjs.io/form-library/documentation/questiontextmodel), and [Comment](https://surveyjs.io/form-library/documentation/questioncommentmodel) question types as cell editors.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))
 */
export class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase
  implements IMatrixDropdownData {
  constructor(name: string) {
    super(name);
    this.createLocalizableString("totalText", this, true);
    this.registerPropertyChangedHandlers(["rows"], () => {
      this.clearGeneratedRows();
      this.resetRenderedTable();
      if (!this.filterItems()) {
        this.onRowsChanged();
      }
      this.clearIncorrectValues();
    });
    this.registerPropertyChangedHandlers(["hideIfRowsEmpty"], () => {
      this.updateVisibilityBasedOnRows();
    });
  }
  public getType(): string {
    return "matrixdropdown";
  }
  /**
   * A title for the total row. Applies if at least one column displays total values.
   * @see rowTitleWidth
   * @see columns
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
  public getRowTitleWidth(): string {
    return this.rowTitleWidth;
  }
  /**
   * Specifies whether to hide the question when the matrix has no visible rows.
   * @see rowsVisibleIf
   */
  public get hideIfRowsEmpty(): boolean {
    return this.getPropertyValue("hideIfRowsEmpty");
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
  protected isNewValueCorrect(val: any): boolean {
    return Helpers.isValueObject(val, true);
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
  protected clearValueIfInvisibleCore(reason: string): void {
    super.clearValueIfInvisibleCore(reason);
    this.clearInvisibleValuesInRows();
  }
  protected generateRows(): Array<MatrixDropdownRowModel> {
    var result = new Array<MatrixDropdownRowModel>();
    var rows = !!this.filteredRows ? this.filteredRows : this.rows;
    if (!rows || rows.length === 0) return result;
    var val = this.value;
    if (!val) val = {};
    for (var i = 0; i < rows.length; i++) {
      if (this.isValueEmpty(rows[i].value)) continue;
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
      name: "rows:itemvalue[]", uniqueProperty: "value"
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
