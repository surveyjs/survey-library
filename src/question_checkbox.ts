import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { Helpers } from "./helpers";

/**
 * A Model for a checkbox question
 */
export class QuestionCheckboxModel extends QuestionCheckboxBase {
  constructor(public name: string) {
    super(name);
  }
  public get displayValue(): any {
    if (this.isEmpty()) return "";
    var items = this.visibleChoices;
    var values = this.value;
    var str = "";
    for (var i = 0; i < values.length; i++) {
      var valStr = this.getDisplayValue(items, values[i]);
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
  [],
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
