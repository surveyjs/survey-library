import { JsonObject } from "./jsonobject";
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
  constructor(public name: string) {
    super(name);
    var noneOtherText = this.createLocalizableString("noneText", this, true);
    noneOtherText.onGetTextCallback = function(text) {
      return !!text ? text : surveyLocalization.getString("noneItemText");
    };
    this.noneItemValue.locOwner = this;
    this.noneItemValue.setLocText(noneOtherText);
    var self = this;
    this.registerFunctionOnPropertiesValueChanged(
      ["hasNone", "noneText"],
      function() {
        self.onVisibleChoicesChanged();
      }
    );
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
  public get hasNone(): boolean {
    return this.getPropertyValue("hasNone", false);
  }
  public set hasNone(val: boolean) {
    this.setPropertyValue("hasNone", val);
  }
  protected setNewValue(newValue: any) {
    if (this.hasNone) {
      var value = this.value;
      if (!Helpers.isTwoValueEquals(value, newValue)) {
        var prevNoneIndex = this.noneIndexInArray(value);
        var newNoneIndex = this.noneIndexInArray(newValue);
        if (prevNoneIndex > -1) {
          if (newNoneIndex > -1 && newValue.length > 1) {
            newValue.splice(newNoneIndex, 1);
          }
        } else {
          if (newNoneIndex > -1) {
            newValue = [this.noneItem.value];
          }
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
    return !this.hasNone && super.canUseFilteredChoices();
  }
  protected addToVisibleChoices(items: Array<ItemValue>) {
    if (this.hasNone) {
      items.push(this.noneItem);
    }
    super.addToVisibleChoices(items);
  }
  protected getDisplayValueCore(keysAsText: boolean): any {
    if (this.isEmpty()) return "";
    var items = this.visibleChoices;
    var values = this.value;
    var str = "";
    for (var i = 0; i < values.length; i++) {
      var valStr = this.getChoicesDisplayValue(items, values[i]);
      if (valStr) {
        if (str) str += ", ";
        str += valStr;
      }
    }
    return str;
  }
  public clearIncorrectValues() {
    var val = this.value;
    if (!val) return;
    if (!Array.isArray(val) || val.length == 0) {
      this.clearValue();
      return;
    }
    var newValue = [];
    for (var i = 0; i < val.length; i++) {
      if (!this.hasUnknownValue(val[i], true)) {
        newValue.push(val[i]);
      }
    }
    if (newValue.length == val.length) return;
    if (newValue.length == 0) {
      this.clearValue();
    } else {
      this.value = newValue;
    }
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    var json = super.getConditionJson();
    if (operator == "contains" || operator == "notcontains") {
      json["type"] = "radiogroup";
    }
    return json;
  }
  protected getValueCore() {
    return super.getValueCore() || [];
  }
  public isAnswerCorrect(): boolean {
    return Helpers.isArrayContainsEqual(this.value, this.correctAnswer);
  }
  protected getHasOther(val: any): boolean {
    if (!val || !Array.isArray(val)) return false;
    return val.indexOf(this.otherItem.value) >= 0;
  }
  protected valueFromData(val: any): any {
    if (!val) return val;
    if (!Array.isArray(val)) return [val];
    return super.valueFromData(val);
  }
  protected valueFromDataCore(val: any): any {
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
  protected valueToDataCore(val: any): any {
    if (!val || !val.length) return val;
    for (var i = 0; i < val.length; i++) {
      if (val[i] == this.otherItem.value) {
        if (this.getComment()) {
          var newVal = val.slice();
          newVal[i] = this.getComment();
          return newVal;
        }
      }
    }
    return val;
  }
  public getType(): string {
    return "checkbox";
  }
}
JsonObject.metaData.addClass(
  "checkbox",
  [
    "hasNone:boolean",
    { name: "noneText", serializationProperty: "locNoneText" }
  ],
  function() {
    return new QuestionCheckboxModel("");
  },
  "checkboxbase"
);
QuestionFactory.Instance.registerQuestion("checkbox", name => {
  var q = new QuestionCheckboxModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
