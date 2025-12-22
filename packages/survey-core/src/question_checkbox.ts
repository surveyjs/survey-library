import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import {
  ChoiceItem,
  QuestionCheckboxBase
} from "./question_baseselect";
import { Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IQuestion } from "./base-interfaces";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";
import { settings } from "./settings";

export class CheckboxItem extends ChoiceItem {
  public get isExclusive(): boolean {
    return this.getPropertyValue("isExclusive");
  }
  public set isExclusive(val: boolean) {
    this.setPropertyValue("isExclusive", val);
  }
  protected getBaseType(): string { return "checkboxitem"; }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "showCommentArea" && this.locOwner) {
      (<any>this.locOwner).onItemHasCommentChanged();
    }
  }
}

/**
 * A class that describes the Checkboxes question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-checkbox/ (linkStyle))
 */
export class QuestionCheckboxModel extends QuestionCheckboxBase {
  private selectAllItemValue: ItemValue;
  protected selectAllItemText: LocalizableString;
  private invisibleOldValues: any = {};
  protected defaultSelectedItemValues: Array<ItemValue>;
  constructor(name: string) {
    super(name);
    this.selectAllItemValue = this.createSelectAllItem();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (["showSelectAllItem", "selectAllText"].indexOf(name) > -1) {
      this.onVisibleChoicesChanged();
    }
    if (name === "choices") {
      this.onItemHasCommentChanged();
    }
  }
  supportElementsInChoice(): boolean { return true; }
  protected getDefaultItemComponent(): string {
    return "survey-checkbox-item";
  }
  public getType(): string {
    return "checkbox";
  }
  protected getItemValueType() {
    return "checkboxitem";
  }
  protected createSelectAllItem(): ItemValue {
    const res = this.createItemValue("");
    res.value = "";
    res.id = "selectall";
    this.selectAllItemText = this.createLocalizableString("selectAllText", res, true, "selectAllItemText");
    res.locOwner = this;
    res.setLocText(this.selectAllItemText);
    return res;
  }
  protected onCreating() {
    super.onCreating();
    this.createNewArray("renderedValue");
    this.createNewArray("value");
  }
  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  /**
   * Specifies a property name used to store selected values.
   *
   * Set this property if you want to store selected values in an array of objects instead of an array of primitive values. For example, if you set `valuePropertyName` to `"car"`, the `value` property will contain an array of objects `[{ car: "Ford" }, { car: "Tesla" }]`, not an array of string values `[ "Ford", "Tesla" ]`.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/merge-question-values/ (linkStyle))
   */
  public get valuePropertyName(): string {
    return this.getPropertyValue("valuePropertyName");
  }
  public set valuePropertyName(val: string) {
    this.setPropertyValue("valuePropertyName", val);
  }
  public getValuePropertyName(): string {
    return this.valuePropertyName || (!this.isTheOnlyComment ? "value" : "");
  }
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (!!name && name === this.getValuePropertyName()) {
      const v = this.value;
      if (Array.isArray(v) && index < v.length) return this;
    }
    return null;
  }
  protected getDependedQuestionsByValueName(isDependOn: boolean): Array<IQuestion> {
    if (isDependOn && !!this.getValuePropertyName()) return [];
    return super.getDependedQuestionsByValueName(isDependOn);
  }
  /**
   * Returns the "Select All" choice item. Use this property to change the item's `value` or `text`.
   * @see showSelectAllItem
   */
  public get selectAllItem(): ItemValue {
    return this.selectAllItemValue;
  }
  /**
   * Gets or sets a caption for the "Select All" choice item.
   * @see showSelectAllItem
   */
  public get selectAllText(): string {
    return this.getLocalizableStringText("selectAllText");
  }
  public set selectAllText(val: string) {
    this.setLocalizableStringText("selectAllText", val);
  }
  get locSelectAllText(): LocalizableString {
    return this.getLocalizableString("selectAllText");
  }
  /**
   * Enable this property to display a "Select All" item. When users select it, all other choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices), also become selected.
   * @see selectAll
   * @see isAllSelected
   * @see separateSpecialChoices
   */
  public get showSelectAllItem(): boolean {
    return this.getPropertyValue("showSelectAllItem");
  }
  public set showSelectAllItem(val: boolean) {
    this.setPropertyValue("showSelectAllItem", val);
  }

  public get hasSelectAll(): boolean {
    return this.showSelectAllItem;
  }
  public set hasSelectAll(val: boolean) {
    this.showSelectAllItem = val;
  }
  /**
   * Returns `true` if all choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices), are selected.
   * @see showSelectAllItem
   */
  public get isAllSelected(): boolean {
    return this.allElementsSelected();
  }
  public set isAllSelected(val: boolean) {
    if (val) {
      this.selectAll();
    } else {
      this.clearValueFromUI();
    }
  }
  public toggleSelectAll(): void {
    this.isAllSelected = !this.isAllSelected;
  }
  protected allElementsSelected(): boolean {
    if (this.isNoneItemsSelected()) return false;
    const items = this.getVisibleEnableItems();
    if (items.length === 0) return false;
    const val = this.value;
    if (!val || !Array.isArray(val) || val.length === 0) return false;
    if (val.length < items.length) return false;
    const rVal = [];
    for (let i = 0; i < val.length; i ++) {
      rVal.push(this.getRealValue(val[i]));
    }
    for (let i = 0; i < items.length; i ++) {
      if (rVal.indexOf(items[i].value) < 0) return false;
    }
    return true;
  }
  private isNoneItemsSelected(): boolean {
    const noneItems = this.getNoneItems();
    for (let i = 0; i < noneItems.length; i ++) {
      if (this.isItemSelected(noneItems[i])) return true;
    }
    return false;
  }
  private getNoneItems(): Array<ItemValue> {
    const res = new Array<ItemValue>();
    this.visibleChoices.forEach((item) => {
      if (this.isNoneItem(item)) {
        res.push(item);
      }
    });
    return res;
  }
  /**
   * Selects all choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices).
   *
   * To clear selection, call the `clearValue()` method.
   * @see clearValue
   */
  public selectAll(): void {
    const val: Array<any> = [];
    const items = this.getVisibleEnableItems();
    for (let i = 0; i < items.length; i++) {
      val.push(items[i].value);
    }
    this.renderedValue = val;
  }
  public clickItemHandler(item: ItemValue, checked?: boolean): void {
    this.selectItem(item, checked);
  }
  public selectItem(item: ItemValue, checked?: boolean): void {
    if (this.isReadOnlyAttr || !item) return;
    if (item === this.selectAllItem) {
      if (checked === true || checked === false) {
        this.isAllSelected = checked;
      } else {
        this.toggleSelectAll();
      }
    } else {
      if (this.isNoneItem(item)) {
        this.renderedValue = checked ? [item.value] : [];
      } else {
        const newValue: Array<any> = [].concat(this.renderedValue || []);
        const index = newValue.indexOf(item.value);
        if (checked) {
          if (index < 0) {
            newValue.push(item.value);
          }
        } else {
          if (index > -1) {
            newValue.splice(index, 1);
          }
        }
        this.renderedValue = newValue;
      }
      if (checked) {
        this.onItemSelected(item);
      }
    }
  }
  protected isItemSelectedCore(item: ItemValue): boolean {
    if (item === this.selectAllItem) return this.isAllSelected;
    var val = this.renderedValue;
    if (!val || !Array.isArray(val)) return false;
    for (var i = 0; i < val.length; i++) {
      if (this.isTwoValueEquals(val[i], item.value)) return true;
    }
    return false;
  }
  protected hasUnknownValueItem(val: any, includeOther: boolean = false,
    isFilteredChoices: boolean = true, checkEmptyValue: boolean = false): boolean {
    return super.hasUnknownValueItem(this.getRealValue(val), includeOther, isFilteredChoices, checkEmptyValue);
  }
  protected setCommentValueCore(item: ItemValue, newValue: string): void {
    newValue = this.trimCommentValue(newValue);
    if (this.isOtherItemByValue(item)) {
      super.setCommentValueCore(item, newValue);
    } else {
      this.setCommentPropertyValue(item, newValue);
      const index = this.getItemValIndexByItemValue(item.value);
      if (index > -1) {
        const val = this.createValueCopy();
        const itemVal = val[index];
        if (newValue) {
          itemVal[this.commentPropertyValue] = newValue;
        } else {
          delete itemVal[this.commentPropertyValue];
        }
        this.value = val;
      }
    }
  }
  protected getCommentValueByItem(item: ItemValue): string {
    const index = this.getItemValIndexByItemValue(item.value);
    return index > -1 ? this.value[index][this.commentPropertyValue] : undefined;
  }
  private getItemValIndexByItemValue(itemValue: any): number {
    const val = this.value;
    if (!Array.isArray(val)) return -1;
    for (let i = 0; i < val.length; i++) {
      const rValue = this.getRealValue(val[i]);
      if (Helpers.isTwoValueEquals(rValue, itemValue)) return i;
    }
    return -1;
  }
  public get isTheOnlyComment(): boolean {
    return this.getPropertyValue("isTheOnlyComment", undefined, () => this.calcIsTheOnlyComment());
  }
  private calcIsTheOnlyComment(): boolean {
    for (let i = 0; i < this.choices.length; i++) {
      const ch = this.choices[i];
      if (ch.showCommentArea && ch.value !== this.otherItem.value) return false;
    }
    return true;
  }
  onItemHasCommentChanged(): void {
    this.resetPropertyValue("isTheOnlyComment");
  }
  private getRealValue(val: any): any {
    if (!val || typeof val !== "object") return val;
    const valProp = this.getValuePropertyName();
    return !valProp ? val : val[valProp];
  }
  private getValueFromReal(val: any): any {
    const valProp = this.getValuePropertyName();
    if (!!valProp) {
      const res: any = {};
      res[valProp] = val;
      return res;
    }
    return val;
  }
  public get isValueArray(): boolean { return true; }
  /**
   * Specifies the maximum number of selected choices.
   *
   * Default value: 0 (unlimited)
   *
   * > This property only limits the number of choice items that can be selected by users. You can select any number of choice items in code, regardless of the `maxSelectedChoices` value.
   *
   * [Ranking Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))
   * @see minSelectedChoices
   */
  public get maxSelectedChoices(): number {
    return this.getPropertyValue("maxSelectedChoices");
  }
  public set maxSelectedChoices(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("maxSelectedChoices", val);
    this.filterItems();
  }
  /**
   * Specifies the minimum number of selected choices.
   *
   * Default value: 0 (unlimited)
   *
   * > This property only limits the number of choice items that can be selected by users. You can select any number of choice items in code, regardless of the `minSelectedChoices` value.
   *
   * [Ranking Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))
   * @see maxSelectedChoices
   */
  public get minSelectedChoices(): number {
    return this.getPropertyValue("minSelectedChoices");
  }
  public set minSelectedChoices(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("minSelectedChoices", val);
  }
  /**
   * An array of selected choice items. Includes the "Other", "None", "Refuse to answer", and "Don't know" choice items if they are selected, but not "Select All". Items are sorted in the order they were selected.
   * @see visibleChoices
   * @see enabledChoices
   */
  public get selectedChoices(): Array<ItemValue> {
    const val = this.renderedValue as Array<any>;
    const visChoices = this.visibleChoices;
    const selectedItemValues = this.selectedItemValues;

    if (this.isEmpty()) return [];

    const allChoices = !!this.defaultSelectedItemValues ? [].concat(this.defaultSelectedItemValues, visChoices) : visChoices;
    const itemValues = val.map((item) => { return ItemValue.getItemByValue(allChoices, item); }).filter(item => !!item);
    if (!itemValues.length && !selectedItemValues) {
      this.updateSelectedItemValues();
    }

    const validValues = this.validateItemValues(itemValues);
    return validValues;
  }
  public get selectedItems(): Array<ItemValue> { return this.selectedChoices; }
  public get hasFilteredValue(): boolean { return !!this.getValuePropertyName(); }
  public getFilteredName(): any {
    let res = super.getFilteredName();
    if (this.hasFilteredValue) {
      res += settings.expressionVariables.unwrapPostfix;
    }
    return res;
  }
  public getFilteredValue(isUnwrapped?: boolean): any {
    if (isUnwrapped && this.hasFilteredValue) return this.renderedValue;
    return super.getFilteredValue(isUnwrapped);
  }
  protected getMultipleSelectedItems(): Array<ItemValue> {
    return this.selectedChoices;
  }
  protected validateItemValues(itemValues: Array<ItemValue>): Array<ItemValue> {
    if (!!itemValues.length) return itemValues;

    const selectedItemValues = this.selectedItemValues;
    if (!!selectedItemValues && !!selectedItemValues.length) {
      this.defaultSelectedItemValues = [].concat(selectedItemValues);
      return selectedItemValues;
    }

    const val = this.renderedValue as Array<any>;
    return val.map((item: any) => this.createItemValue(item));
  }
  protected getAnswerCorrectIgnoreOrder(): boolean { return true; }
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    if (isOnValueChanged) return;

    if (this.checkMinSelectedChoicesUnreached()) {
      const minError = new CustomError(
        this.getLocalizationFormatString("minSelectError", this.minSelectedChoices),
        this
      );
      errors.push(minError);
    }
  }
  protected onVisibleChoicesChanged(): void {
    super.onVisibleChoicesChanged();
    this.updateSelectAllItemProps();
  }
  protected onEnableItemCallBack(item: ItemValue): boolean {
    if (!this.shouldCheckMaxSelectedChoices()) return true;
    return this.isItemSelected(item);
  }
  protected onAfterRunItemsEnableCondition(): void {
    this.updateSelectAllItemProps();
    const isEnabled = this.maxSelectedChoices < 1 || this.isOtherSelected || !this.shouldCheckMaxSelectedChoices();
    this.otherItem.setIsEnabled(isEnabled);
  }
  private updateSelectAllItemProps(): void {
    if (!this.showSelectAllItem) return;
    this.selectAllItem.setIsEnabled(this.getSelectAllEnabled());
  }
  private getSelectAllEnabled(): boolean {
    if (!this.showSelectAllItem) return true;
    let visCount = this.getVisibleEnableItems().length;
    const max = this.maxSelectedChoices;
    if (max > 0 && max < visCount) return false;
    return visCount > 0;
  }
  private getVisibleEnableItems(): Array<ItemValue> {
    const res = new Array<ItemValue>();
    const items = this.visibleChoices;
    for (let i = 0; i < items.length; i ++) {
      const item = items[i];
      if (item.isEnabled && !this.isBuiltInChoice(item) && !item.isExclusive) {
        res.push(item);
      }
    }
    return res;
  }
  private shouldCheckMaxSelectedChoices(): boolean {
    if (this.maxSelectedChoices < 1) return false;
    var val = this.value;
    var len = !Array.isArray(val) ? 0 : val.length;
    return len >= this.maxSelectedChoices;
  }

  private checkMinSelectedChoicesUnreached(): boolean {
    if (this.minSelectedChoices < 1) return false;
    var val = this.value;
    var len = !Array.isArray(val) ? 0 : val.length;
    if (len === 1 && this.isNoneItemsSelected()) return false;
    return len < this.minSelectedChoices;
  }

  protected getItemClassCore(item: any, options: any) {
    const __dummy_value = this.value; //trigger dependencies from koValue for knockout
    options.isSelectAllItem = item === this.selectAllItem;
    return new CssClassBuilder()
      .append(super.getItemClassCore(item, options))
      .append(this.cssClasses.itemSelectAll, options.isSelectAllItem)
      .toString();
  }
  updateValueFromSurvey(newValue: any, clearData: boolean): void {
    super.updateValueFromSurvey(newValue, clearData);
    this.invisibleOldValues = {};
  }
  onSurveyLoad(): void {
    this.onItemHasCommentChanged();
    super.onSurveyLoad();
  }
  protected setDefaultUnknownValue(val : any): void {
    if (!Array.isArray(val)) {
      super.setDefaultUnknownValue(val);
      return;
    }
    if (!this.hasActiveChoices) {
      for (var i = 0; i < val.length; i++) {
        const rVal = this.getRealValue(val[i]);
        this.addIntoInvisibleOldValues(rVal);
      }
      this.value = val;
    } else {
      const newVal = [];
      let otherVal = "";
      for (var i = 0; i < val.length; i++) {
        const rVal = this.getRealValue(val[i]);
        if (!this.hasUnknownValue(rVal)) {
          newVal.push(rVal);
        } else {
          if (!otherVal) {
            otherVal = rVal;
            newVal.push(this.otherItem.value);
          }
        }
      }
      this.renderedValue = newVal;
      this.otherValue = otherVal;
    }
  }
  private addIntoInvisibleOldValues(val: any) {
    this.invisibleOldValues[val] = val;
  }
  protected hasValueToClearIncorrectValues(): boolean {
    return super.hasValueToClearIncorrectValues() || !Helpers.isValueEmpty(this.invisibleOldValues);
  }
  protected setNewValue(newValue: any) {
    if (!this.isChangingValueOnClearIncorrect) {
      this.invisibleOldValues = {};
    }
    newValue = this.valueFromData(newValue);
    var value = this.value;
    if (!newValue) newValue = [];
    if (!value) value = [];
    if (this.isTwoValueEquals(value, newValue)) return;
    this.removeNoneItemsValues(value, newValue);
    super.setNewValue(newValue);
  }
  protected getCommentFromValue(newValue: any): string {
    var ind = this.getFirstUnknownIndex(newValue);
    if (ind < 0) return "";
    return newValue[ind];
  }
  public getStoreOthersAsComment(): boolean {
    if (!!this.getValuePropertyName()) return false;
    return super.getStoreOthersAsComment();
  }
  protected setOtherValueIntoValue(newValue: any): any {
    var ind = this.getFirstUnknownIndex(newValue);
    if (ind < 0) return newValue;
    let otherVal: any = this.otherItem.value;
    const propName = this.getValuePropertyName();
    if (propName) {
      const obj: any = {};
      obj[propName] = otherVal;
      otherVal = obj;
    }
    newValue.splice(ind, 1, otherVal);
    return newValue;
  }
  private getFirstUnknownIndex(newValue: any): number {
    if (!Array.isArray(newValue)) return -1;
    for (var i = 0; i < newValue.length; i++) {
      if (this.hasUnknownValueItem(newValue[i], false, false)) return i;
    }
    return -1;
  }
  protected removeNoneItemsValues(value: Array<any>, newValue: Array<any>): void {
    if (value.length === 1 && newValue.length === 1
      && this.getRealValue(value[0]) === this.getRealValue(newValue[0])) return;
    const noneValues = this.getNoneItems().map(item => item.value);
    if (noneValues.length > 0) {
      const prevNone = this.noneIndexInArray(value, noneValues);
      const newNone = this.noneIndexInArray(newValue, noneValues);
      if (prevNone.index > -1) {
        if (prevNone.val === newNone.val) {
          if (newValue.length > 0) {
            newValue.splice(newNone.index, 1);
          }
        } else {
          const prevNewNone = this.noneIndexInArray(newValue, [prevNone.val]);
          if (prevNewNone.index > -1 && prevNewNone.index < newValue.length - 1) {
            newValue.splice(prevNewNone.index, 1);
          }
        }
      } else {
        if (newNone.index > -1 && newValue.length > 1) {
          newValue.splice(0, newValue.length, this.getValueFromReal(newNone.val));
        }
      }
    }
  }

  private noneIndexInArray(val: any, noneValues: Array<any>): { index: number, val: any } {
    if (!Array.isArray(val)) return { index: -1, val: undefined };
    for (var i = val.length - 1; i >= 0; i--) {
      const index = noneValues.indexOf(this.getRealValue(val[i]));
      if (index > -1) return { index: i, val: noneValues[index] };
    }
    return { index: -1, val: undefined };
  }
  protected supportSelectAll(): boolean {
    return this.isSupportProperty("showSelectAllItem");
  }
  protected addNonChoicesItems(dict: Array<{ index: number, item: ItemValue }>, isAddAll: boolean): void {
    super.addNonChoicesItems(dict, isAddAll);
    if (this.supportSelectAll()) {
      this.addNonChoiceItem(dict, this.selectAllItem, isAddAll, this.showSelectAllItem, settings.specialChoicesOrder.selectAllItem);
    }
  }
  public isBuiltInChoice(item: ItemValue): boolean {
    return item === this.selectAllItem || super.isBuiltInChoice(item);
  }

  public isItemInList(item: ItemValue): boolean {
    if (item == this.selectAllItem) return this.showSelectAllItem;
    return super.isItemInList(item);
  }
  protected getDisplayValueEmpty(): string {
    return ItemValue.getTextOrHtmlByValue(this.visibleChoices.filter(choice => choice != this.selectAllItemValue), undefined);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!Array.isArray(value))
      return super.getDisplayValueCore(keysAsText, value);
    const valuePropName = this.getValuePropertyName();
    const onGetValueCallback = (index: number): any => {
      let val = value[index];
      if (!!valuePropName && !!val[valuePropName]) {
        val = val[valuePropName];
      }
      return val;
    };
    return this.getDisplayArrayValue(keysAsText, value, onGetValueCallback);
  }
  protected clearIncorrectValuesCore(): void {
    this.clearIncorrectAndDisabledValues(false);
  }
  protected clearDisabledValuesCore(): void {
    this.clearIncorrectAndDisabledValues(true);
  }
  private isChangingValueOnClearIncorrect: boolean = false;
  private clearIncorrectAndDisabledValues(clearDisabled: boolean) {
    var val = this.value;
    var hasChanged = false;
    var restoredValues = this.restoreValuesFromInvisible();
    if (!val && restoredValues.length == 0) return;
    if (!Array.isArray(val) || val.length == 0) {
      this.isChangingValueOnClearIncorrect = true;
      if (!clearDisabled) {
        if (this.showCommentArea) {
          this.value = null;
        } else {
          this.clearValue(true);
        }
      }
      this.isChangingValueOnClearIncorrect = false;
      if (restoredValues.length == 0) return;
      val = [];
    }
    var newValue = [];
    for (var i = 0; i < val.length; i++) {
      const rItemVal = this.getRealValue(val[i]);
      var isUnkown = this.canClearValueAnUnknown(rItemVal);
      if (
        (!clearDisabled && !isUnkown) ||
        (clearDisabled && !this.isValueDisabled(rItemVal))
      ) {
        newValue.push(val[i]);
      } else {
        hasChanged = true;
        if (isUnkown) {
          this.addIntoInvisibleOldValues(val[i]);
        }
      }
    }
    for (var i = 0; i < restoredValues.length; i++) {
      newValue.push(restoredValues[i]);
      hasChanged = true;
    }
    if (!hasChanged) return;
    this.isChangingValueOnClearIncorrect = true;
    if (newValue.length == 0) {
      this.clearValue(true);
    } else {
      this.value = newValue;
    }
    this.isChangingValueOnClearIncorrect = false;
  }
  private restoreValuesFromInvisible(): Array<any> {
    var res = [];
    var visItems = this.visibleChoices;
    for (var i = 0; i < visItems.length; i++) {
      const item = visItems[i];
      if (item === this.selectAllItem) continue;
      var val = visItems[i].value;
      if (Helpers.isTwoValueEquals(val, this.invisibleOldValues[val])) {
        if (!this.isItemSelected(item)) {
          res.push(val);
        }
        delete this.invisibleOldValues[val];
      }
    }
    return res;
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    const json = super.getConditionJson(operator, path);
    if (operator == "contains" || operator == "notcontains") {
      json["type"] = "radiogroup";
    }
    json["maxSelectedChoices"] = 0;
    json["minSelectedChoices"] = 0;
    return json;
  }
  public isAnswerCorrect(): boolean {
    return Helpers.isArrayContainsEqual(this.value, this.correctAnswer);
  }
  protected setDefaultValueWithOthers() {
    this.value = this.renderedValueFromDataCore(this.defaultValue);
  }
  protected getIsItemValue(val: any, item: ItemValue): boolean {
    if (!val || !Array.isArray(val)) return false;
    return val.indexOf(item.value) >= 0;
  }
  protected valueFromData(val: any): any {
    if (!val) return val;
    if (!Array.isArray(val)) return [super.valueFromData(val)];
    let value = [];
    for (let i = 0; i < val.length; i++) {
      const choiceitem = this.getItemByValue(val[i], this.visibleChoices);
      if (!!choiceitem) {
        value.push(this.getChoiceValue(choiceitem, val[i], true));
      } else {
        value.push(val[i]);
      }
    }
    return value;
  }
  protected rendredValueFromData(val: any): any {
    val = this.convertValueFromObject(val);
    return super.rendredValueFromData(val);
  }
  private convertValueFromObject(val: any): any {
    const valProp = this.getValuePropertyName();
    if (!valProp || !Array.isArray(val)) return val;
    const res = [];
    for (let i = 0; i < val.length; i++) {
      res.push(this.getRealValue(val[i]));
    }
    return res;
  }
  protected renderedValueFromDataCore(val: any): any {
    if (!val || !Array.isArray(val)) val = [];
    if (!this.hasActiveChoices) return val;
    for (var i = 0; i < val.length; i++) {
      if (val[i] == this.otherItem.value) return val;
      if (this.hasUnknownValueItem(val[i], true, false)) {
        this.otherValue = val[i];
        var newVal = val.slice();
        newVal[i] = this.otherItem.value;
        return newVal;
      }
    }
    return val;
  }
  protected renderedValueToDataCore(val: any): any {
    if (!val || !val.length) return val;
    const res = [];
    const qVal = this.createValueCopy();
    for (var i = 0; i < val.length; i++) {
      let index = -1;
      let valItem = val[i];
      if (valItem === this.otherItem.value && this.needConvertRenderedOtherToDataValue()) {
        index = this.getFirstUnknownIndex(qVal);
        valItem = this.otherValue;
        if (index > -1) {
          qVal[index] = this.getValueFromReal(this.otherValue);
        }
      } else {
        index = this.getItemValIndexByItemValue(valItem);
      }
      if (index > -1) {
        res.push(qVal[index]);
      } else {
        res.push(this.getValueFromReal(valItem));
      }
    }
    return res;
  }
  protected valueToData(val: any): any {
    if (Helpers.isValueEmpty(val)) return val;
    if (!Array.isArray(val)) {
      val = [val];
    }
    const valProp = this.getValuePropertyName();
    if (!valProp) return val;
    const res = [];
    for (let i = 0; i < val.length; i++) {
      const item = val[i];
      res.push(typeof item === "object" ? item : this.getValueFromReal(item));
    }
    return res;
  }
  protected selectOtherValueFromComment(val: boolean): void {
    var newVal = [];
    const rendVal = this.renderedValue;
    if (Array.isArray(rendVal)) {
      for (var i = 0; i < rendVal.length; i++) {
        if (rendVal[i] !== this.otherItem.value) {
          newVal.push(rendVal[i]);
        }
      }
    }
    if (val) {
      newVal.push(this.otherItem.value);
    }
    this.value = newVal;
  }
  public get checkBoxSvgPath(): string {
    return "M5,13l2-2l3,3l7-7l2,2l-9,9L5,13z";
  }

  //a11y
  public get isNewA11yStructure(): boolean {
    return true;
  }
  public get a11y_input_ariaRole(): string {
    return "group";
  }
  public get a11y_input_ariaRequired(): "true" | "false" {
    return null;
  }
  // EO a11y
}
Serializer.addClass("checkboxitem",
  [{ name: "isExclusive:boolean", locationInTable: "detail" }],
  (value: any) => new CheckboxItem(value), "choiceitem");

Serializer.addClass(
  "checkbox",
  [
    { name: "showSelectAllItem:boolean", alternativeName: "hasSelectAll" },
    { name: "separateSpecialChoices", visible: true },
    { name: "maxSelectedChoices:number", default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) return 0;
        const min = obj.minSelectedChoices;
        return min > 0 && val < min ? min : val;
      }
    },
    { name: "minSelectedChoices:number", default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) return 0;
        const max = obj.maxSelectedChoices;
        return max > 0 && val > max ? max : val;
      }
    },
    {
      name: "selectAllText",
      serializationProperty: "locSelectAllText",
      dependsOn: "showSelectAllItem",
      visibleIf: function (obj: any) {
        return obj.showSelectAllItem;
      }
    },
    {
      name: "valuePropertyName",
      category: "data"
    },
    { name: "itemComponent", visible: false, default: "survey-checkbox-item" }
  ],
  function () {
    return new QuestionCheckboxModel("");
  },
  "checkboxbase"
);
Serializer.getProperty("checkbox", "choices").type = "checkboxitem[]";

QuestionFactory.Instance.registerQuestion("checkbox", (name) => {
  var q = new QuestionCheckboxModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
