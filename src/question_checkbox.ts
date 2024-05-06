import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import {
  QuestionCheckboxBase,
  QuestionSelectBase,
} from "./question_baseselect";
import { Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IQuestion } from "./base-interfaces";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";
import { settings } from "./settings";

/**
 * A class that describes the Checkboxes question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-checkbox/ (linkStyle))
 */
export class QuestionCheckboxModel extends QuestionCheckboxBase {
  private selectAllItemValue: ItemValue;
  private invisibleOldValues: any = {};
  protected defaultSelectedItemValues: Array<ItemValue>;
  constructor(name: string) {
    super(name);
    this.selectAllItemValue = new ItemValue("");
    this.selectAllItemValue.id = "selectall";
    var selectAllItemText = this.createLocalizableString(
      "selectAllText", this.selectAllItem, true, "selectAllItemText");
    this.selectAllItem.locOwner = this;
    this.selectAllItem.setLocText(selectAllItemText);

    this.registerPropertyChangedHandlers(
      ["showSelectAllItem", "selectAllText"],
      () => {
        this.onVisibleChoicesChanged();
      }
    );
  }
  protected getDefaultItemComponent(): string {
    return "survey-checkbox-item";
  }
  public getType(): string {
    return "checkbox";
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
   */
  public get valuePropertyName(): string {
    return this.getPropertyValue("valuePropertyName");
  }
  public set valuePropertyName(val: string) {
    this.setPropertyValue("valuePropertyName", val);
  }
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (!!name && name === this.valuePropertyName) {
      const v = this.value;
      if (Array.isArray(v) && index < v.length) return this;
    }
    return null;
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
   * Enable this property to display a "Select All" item. When users select it, all other choice items, except "Other" and "None", also become selected.
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
   * Returns `true` if all choice items, except "Other" and "None", are selected.
   * @see showSelectAllItem
   */
  public get isAllSelected(): boolean {
    const noneItems = this.getNoneItems();
    for(let i = 0; i < noneItems.length; i ++) {
      if(this.isItemSelected(noneItems[i])) return false;
    }
    const items = this.getVisibleEnableItems();
    if(items.length === 0) return false;
    const val = this.value;
    if (!val || !Array.isArray(val) || val.length === 0) return false;
    if(val.length < items.length) return false;
    const rVal = [];
    for(let i = 0; i < val.length; i ++) {
      rVal.push(this.getRealValue(val[i]));
    }
    for(let i = 0; i < items.length; i ++) {
      if(rVal.indexOf(items[i].value) < 0) return false;
    }
    return true;
  }
  public set isAllSelected(val: boolean) {
    if (val) {
      this.selectAll();
    } else {
      this.clearValue();
    }
  }
  public toggleSelectAll(): void {
    this.isAllSelected = !this.isAllSelected;
  }
  /**
   * Selects all choice items, except "Other" and "None".
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
    if(item === this.selectAllItem) {
      if(checked === true || checked === false) {
        this.isAllSelected = checked;
      } else {
        this.toggleSelectAll();
      }
    } else {
      if(this.isNoneItem(item)) {
        this.renderedValue = [item.value];
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
  private getRealValue(val: any): any {
    if (!val) return val;
    return !this.valuePropertyName ? val : val[this.valuePropertyName];
  }
  public get isValueArray(): boolean { return true; }
  /**
   * Specifies the maximum number of selected choices.
   *
   * Default value: 0 (unlimited)
   *
   * > This property only limits the number of choice items that can be selected by users. You can select any number of choice items in code, regardless of the `maxSelectedChoices` value.
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
   * An array of selected choice items. Includes the "Other" and "None" choice items if they are selected, but not "Select All". Items are sorted in the order they were selected.
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
    if(!itemValues.length && !selectedItemValues) {
      this.updateSelectedItemValues();
    }

    return this.validateItemValues(itemValues);
  }
  public get selectedItems(): Array<ItemValue> { return this.selectedChoices; }
  public get hasFilteredValue(): boolean { return !!this.valuePropertyName; }
  public getFilteredName(): any {
    let res = super.getFilteredName();
    if(this.hasFilteredValue) {
      res += "-unwrapped";
    }
    return res;
  }
  public getFilteredValue(): any {
    if(this.hasFilteredValue) return this.renderedValue;
    return super.getFilteredValue();
  }
  protected getMultipleSelectedItems(): Array<ItemValue> {
    return this.selectedChoices;
  }
  protected validateItemValues(itemValues: Array<ItemValue>): Array<ItemValue> {
    if(!!itemValues.length) return itemValues;

    const selectedItemValues = this.selectedItemValues;
    if(!!selectedItemValues && !!selectedItemValues.length) {
      this.defaultSelectedItemValues = [].concat(selectedItemValues);
      return selectedItemValues;
    }

    const val = this.renderedValue as Array<any>;
    return val.map((item: any) => this.createItemValue(item));
  }
  protected getAnswerCorrectIgnoreOrder(): boolean { return true; }
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ): void {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (isOnValueChanged) return;

    if (this.minSelectedChoices > 0 && this.checkMinSelectedChoicesUnreached()) {
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
    if (this.maxSelectedChoices < 1) {
      this.otherItem.setIsEnabled(true);
      return;
    }
    if (this.hasOther) {
      this.otherItem.setIsEnabled(
        !this.shouldCheckMaxSelectedChoices() || this.isOtherSelected
      );
    }
  }
  private updateSelectAllItemProps(): void {
    if (!this.hasSelectAll) return;
    this.selectAllItem.setIsEnabled(this.getSelectAllEnabled());
  }
  private getSelectAllEnabled(): boolean {
    if (!this.hasSelectAll) return true;
    const items = this.activeChoices;
    let visCount = this.getVisibleEnableItems().length;
    const max = this.maxSelectedChoices;
    if(max > 0 && max < visCount) return false;
    return visCount > 0;
  }
  private getVisibleEnableItems(): Array<ItemValue> {
    const res = new Array<ItemValue>();
    const items = this.activeChoices;
    for(let i = 0; i < items.length; i ++) {
      const item = items[i];
      if(item.isEnabled && item.isVisible) {
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
  protected setDefaultValue() {
    super.setDefaultValue();
    const val = this.defaultValue;
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) {
        const rVal = this.getRealValue(val[i]);
        if (this.canClearValueAnUnknown(rVal)) {
          this.addIntoInvisibleOldValues(rVal);
        }
      }
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
  protected getIsMultipleValue(): boolean {
    return true;
  }
  protected getCommentFromValue(newValue: any): string {
    var ind = this.getFirstUnknownIndex(newValue);
    if (ind < 0) return "";
    return newValue[ind];
  }
  protected setOtherValueIntoValue(newValue: any): any {
    var ind = this.getFirstUnknownIndex(newValue);
    if (ind < 0) return newValue;
    newValue.splice(ind, 1, this.otherItem.value);
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
    const noneValues: Array<any> = [];
    if(this.showNoneItem) noneValues.push(this.noneItem.value);
    if(this.showRefuseItem) noneValues.push(this.refuseItem.value);
    if(this.showDontKnowItem) noneValues.push(this.dontKnowItem.value);
    if (noneValues.length > 0) {
      const prevNone = this.noneIndexInArray(value, noneValues);
      const newNone = this.noneIndexInArray(newValue, noneValues);
      if(prevNone.index > -1) {
        if(prevNone.val === newNone.val) {
          if(newValue.length > 0) {
            newValue.splice(newNone.index, 1);
          }
        } else {
          const prevNewNone = this.noneIndexInArray(newValue, [prevNone.val]);
          if(prevNewNone.index > -1 && prevNewNone.index < newValue.length - 1) {
            newValue.splice(prevNewNone.index, 1);
          }
        }
      } else {
        if (newNone.index > -1 && newValue.length > 1) {
          const itemVal = this.convertValueToObject([newNone.val])[0];
          newValue.splice(0, newValue.length, itemVal);
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
  protected canUseFilteredChoices(): boolean {
    return !this.hasSelectAll && super.canUseFilteredChoices();
  }
  protected supportSelectAll(): boolean {
    return this.isSupportProperty("showSelectAllItem");
  }
  protected addNonChoicesItems(dict: Array<{ index: number, item: ItemValue }>, isAddAll: boolean): void {
    super.addNonChoicesItems(dict, isAddAll);
    if (this.supportSelectAll()) {
      this.addNonChoiceItem(dict, this.selectAllItem, isAddAll, this.hasSelectAll, settings.specialChoicesOrder.selectAllItem);
    }
  }
  protected isBuiltInChoice(item: ItemValue): boolean {
    return item === this.selectAllItem || super.isBuiltInChoice(item);
  }

  public isItemInList(item: ItemValue): boolean {
    if (item == this.selectAllItem) return this.hasSelectAll;
    return super.isItemInList(item);
  }
  protected getDisplayValueEmpty(): string {
    return ItemValue.getTextOrHtmlByValue(this.visibleChoices.filter(choice => choice != this.selectAllItemValue), undefined);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!Array.isArray(value))
      return super.getDisplayValueCore(keysAsText, value);
    const valuePropName = this.valuePropertyName;
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
        if (this.hasComment) {
          this.value = null;
        } else {
          this.clearValue();
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
      this.clearValue();
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
      if(item === this.selectAllItem) continue;
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
      let choiceitem = ItemValue.getItemByValue(this.activeChoices, val[i]);
      if (!!choiceitem) {
        value.push(choiceitem.value);
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
  protected rendredValueToData(val: any): any {
    val = super.rendredValueToData(val);
    return this.convertValueToObject(val);
  }
  protected convertValueFromObject(val: any): any {
    if (!this.valuePropertyName) return val;
    return Helpers.convertArrayObjectToValue(val, this.valuePropertyName);
  }
  protected convertValueToObject(val: any): any {
    if (!this.valuePropertyName) return val;
    let dest = undefined;
    if (!!this.survey && this.survey.questionsByValueName(this.getValueName()).length > 1) {
      dest = this.data.getValue(this.getValueName());
    }
    return Helpers.convertArrayValueToObject(val, this.valuePropertyName, dest);
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
  protected rendredValueToDataCore(val: any): any {
    if (!val || !val.length) return val;
    for (var i = 0; i < val.length; i++) {
      if (val[i] == this.otherItem.value) {
        if (this.needConvertRenderedOtherToDataValue()) {
          var newVal = val.slice();
          newVal[i] = this.otherValue;
          return newVal;
        }
      }
    }
    return val;
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
    return "listbox";
  }
  // EO a11y
}
Serializer.addClass(
  "checkbox",
  [
    { name: "showSelectAllItem:boolean", alternativeName: "hasSelectAll" },
    { name: "separateSpecialChoices", visible: true },
    { name: "maxSelectedChoices:number", default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if(val <= 0) return 0;
        const min = obj.minSelectedChoices;
        return min > 0 && val < min ? min : val;
      }
    },
    { name: "minSelectedChoices:number", default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if(val <= 0) return 0;
        const max = obj.maxSelectedChoices;
        return max > 0 && val > max ? max : val;
      }
    },
    {
      name: "selectAllText",
      serializationProperty: "locSelectAllText",
      dependsOn: "showSelectAllItem",
      visibleIf: function (obj: any) {
        return obj.hasSelectAll;
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
QuestionFactory.Instance.registerQuestion("checkbox", (name) => {
  var q = new QuestionCheckboxModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
