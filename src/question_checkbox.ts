import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for a checkbox question
 */
export class QuestionCheckboxModel extends QuestionCheckboxBase {
  private noneItemValue: ItemValue = new ItemValue("none");
  private selectAllItemValue: ItemValue = new ItemValue("selectall");
  private invisibleOldValues: any = {};
  constructor(public name: string) {
    super(name);
    var noneItemText = this.createLocalizableString("noneText", this, true);
    noneItemText.onGetTextCallback = function (text) {
      return !!text ? text : surveyLocalization.getString("noneItemText");
    };
    this.noneItemValue.locOwner = this;
    this.noneItemValue.setLocText(noneItemText);

    var selectAllItemText = this.createLocalizableString(
      "selectAllText",
      this,
      true
    );
    selectAllItemText.onGetTextCallback = function (text) {
      return !!text ? text : surveyLocalization.getString("selectAllItemText");
    };
    this.selectAllItem.locOwner = this;
    this.selectAllItem.setLocText(selectAllItemText);

    var self = this;
    this.registerFunctionOnPropertiesValueChanged(
      ["hasNone", "noneText", "hasSelectAll", "selectAllText"],
      function () {
        self.onVisibleChoicesChanged();
      }
    );
  }
  public get ariaRole(): string {
    return "group";
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
   * Returns the select all item. By using this property, you may change programmatically it's value and text.
   * @see hasSelectAll
   */
  public get selectAllItem(): ItemValue {
    return this.selectAllItemValue;
  }
  /**
   * Returns the none item. By using this property, you may change programmatically it's value and text.
   * @see hasNone
   */
  public get noneItem(): ItemValue {
    return this.noneItemValue;
  }
  /**
   * Use this property to set the different text for none item.
   */
  public get noneText(): string {
    return this.getLocalizableStringText(
      "noneText",
      surveyLocalization.getString("noneItemText")
    );
  }
  public set noneText(val: string) {
    this.setLocalizableStringText("noneText", val);
  }
  get locNoneText(): LocalizableString {
    return this.getLocalizableString("noneText");
  }
  /**
   * Use this property to set the different text for Select All item.
   */
  public get selectAllText(): string {
    return this.getLocalizableStringText(
      "selectAllText",
      surveyLocalization.getString("selectAllItemText")
    );
  }
  public set selectAllText(val: string) {
    this.setLocalizableStringText("selectAllText", val);
  }
  get locSelectAllText(): LocalizableString {
    return this.getLocalizableString("selectAllText");
  }
  /**
   * Set this property to true, to show the "Select All" item on the top. If end-user checks this item, then all items are checked.
   */
  public get hasSelectAll(): boolean {
    return this.getPropertyValue("hasSelectAll", false);
  }
  public set hasSelectAll(val: boolean) {
    this.setPropertyValue("hasSelectAll", val);
  }
  /**
   * Returns true if all items are selected
   * @see toggleSelectAll
   */
  public get isAllSelected(): boolean {
    var val = this.value;
    if (!val || !Array.isArray(val)) return false;
    if (this.isItemSelected(this.noneItem)) return false;
    var allItemCount = this.visibleChoices.length;
    if (this.hasOther) allItemCount--;
    if (this.hasNone) allItemCount--;
    if (this.hasSelectAll) allItemCount--;
    var selectedCount = val.length;
    if (this.isItemSelected(this.otherItem)) selectedCount--;
    return selectedCount === allItemCount;
  }
  public set isAllSelected(val: boolean) {
    if (val) {
      this.selectAll();
    } else {
      this.clearValue();
    }
  }
  /**
   * It will select all items, except other and none. If all items have been already selected then it will clear the value
   * @see isAllSelected
   * @see selectAll
   */
  public toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
  }
  /**
   * Select all items, except other and none.
   */
  public selectAll() {
    var val = [];
    for (var i = 0; i < this.visibleChoices.length; i++) {
      var item = this.visibleChoices[i];
      if (
        item === this.noneItem ||
        item === this.otherItem ||
        item === this.selectAllItem
      )
        continue;
      val.push(item.value);
    }
    this.value = val;
  }
  /**
   * Set this property to true, to show the "None" item on the bottom. If end-user checks this item, all other items would be unchecked.
   */
  public get hasNone(): boolean {
    return this.getPropertyValue("hasNone", false);
  }
  public set hasNone(val: boolean) {
    this.setPropertyValue("hasNone", val);
  }
  /**
   * Returns true if item is checked
   * @param item checkbox item value
   */
  public isItemSelected(item: ItemValue): boolean {
    if (item === this.selectAllItem) return this.isAllSelected;
    var val = this.renderedValue;
    if (!val || !Array.isArray(val)) return false;
    for (var i = 0; i < val.length; i++) {
      if (Helpers.isTwoValueEquals(val[i], item.value)) return true;
    }
    return false;
  }
  protected setNewValue(newValue: any) {
    if (!this.isChangingValueOnClearIncorrect) {
      this.invisibleOldValues = [];
    }
    newValue = this.valueFromData(newValue);
    var value = this.value;
    if (!newValue) newValue = [];
    if (!value) value = [];
    if (Helpers.isTwoValueEquals(value, newValue)) return;
    if (this.hasNone) {
      var prevNoneIndex = this.noneIndexInArray(value);
      var newNoneIndex = this.noneIndexInArray(newValue);
      if (prevNoneIndex > -1) {
        if (newNoneIndex > -1 && newValue.length > 1) {
          newValue.splice(newNoneIndex, 1);
        }
      } else {
        if (newNoneIndex > -1) {
          newValue.splice(0, newValue.length);
          newValue.push(this.noneItem.value);
        }
      }
    }
    super.setNewValue(newValue);
  }
  private noneIndexInArray(val: any) {
    if (!val || !Array.isArray(val)) return -1;
    var noneValue = this.noneItem.value;
    for (var i = 0; i < val.length; i++) {
      if (val[i] == noneValue) return i;
    }
    return -1;
  }
  protected canUseFilteredChoices(): boolean {
    return !this.hasNone && !this.hasSelectAll && super.canUseFilteredChoices();
  }
  protected addToVisibleChoices(items: Array<ItemValue>) {
    if (this.hasSelectAll) {
      items.unshift(this.selectAllItem);
    }
    super.addToVisibleChoices(items);
    if (this.hasNone) {
      items.push(this.noneItem);
    }
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!Array.isArray(value))
      return super.getDisplayValueCore(keysAsText, value);
    var items = this.visibleChoices;
    var str = "";
    for (var i = 0; i < value.length; i++) {
      var valStr = this.getChoicesDisplayValue(items, value[i]);
      if (valStr) {
        if (str) str += ", ";
        str += valStr;
      }
    }
    return str;
  }
  protected clearIncorrectValuesCore() {
    this.clearIncorrectAndDisabledValues(false);
  }
  protected clearDisabledValuesCore() {
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
      var isUnkown = this.canClearValueAnUnknow(val[i]);
      if (
        (!clearDisabled && !isUnkown) ||
        (clearDisabled && !this.isValueDisabled(val[i]))
      ) {
        newValue.push(val[i]);
      } else {
        hasChanged = true;
        if (isUnkown) {
          this.invisibleOldValues[val[i]] = true;
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
      var val = visItems[i].value;
      if (this.invisibleOldValues[val]) {
        res.push(val);
        delete this.invisibleOldValues[val];
      }
    }
    return res;
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    var json = super.getConditionJson();
    if (operator == "contains" || operator == "notcontains") {
      json["type"] = "radiogroup";
    }
    return json;
  }
  public isAnswerCorrect(): boolean {
    return Helpers.isArrayContainsEqual(this.value, this.correctAnswer);
  }
  protected setDefaultValueWithOthers() {
    this.value = this.renderedValueFromDataCore(this.defaultValue);
  }
  protected getHasOther(val: any): boolean {
    if (!val || !Array.isArray(val)) return false;
    return val.indexOf(this.otherItem.value) >= 0;
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
  protected renderedValueFromDataCore(val: any): any {
    if (!val || !Array.isArray(val)) val = [];
    for (var i = 0; i < val.length; i++) {
      if (val[i] == this.otherItem.value) return val;
      if (this.hasUnknownValue(val[i])) {
        this.comment = val[i];
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
        if (this.getQuestionComment()) {
          var newVal = val.slice();
          newVal[i] = this.getQuestionComment();
          return newVal;
        }
      }
    }
    return val;
  }
  protected hasUnknownValue(val: any, includeOther: boolean = false): boolean {
    if (this.hasNone && val == this.noneItemValue.value) return false;
    return super.hasUnknownValue(val, includeOther);
  }
  protected addSupportedValidators(supportedValidators: Array<string>) {
    super.addSupportedValidators(supportedValidators);
    supportedValidators.push("answercount");
  }
}
Serializer.addClass(
  "checkbox",
  [
    "hasSelectAll:boolean",
    "hasNone:boolean",
    { name: "noneText", serializationProperty: "locNoneText" },
    { name: "selectAllText", serializationProperty: "locSelectAllText" },
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
