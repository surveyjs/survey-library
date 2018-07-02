import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { JsonObject } from "./jsonobject";
import { ConditionRunner, Operand } from "./conditions";
import { ProcessValue } from "./conditionProcessValue";

/**
 * A base class for all triggers.
 * A trigger calls a method when the expression change the result: from false to true or from true to false.
 * Please note, it runs only one changing the expression result.
 */
export class Trigger extends Base {
  static operatorsValue: HashTable<Function> = null;
  static get operators() {
    if (Trigger.operatorsValue != null) return Trigger.operatorsValue;
    Trigger.operatorsValue = {
      empty: function(value, expectedValue) {
        return !value;
      },
      notempty: function(value, expectedValue) {
        return !!value;
      },
      equal: function(value, expectedValue) {
        return value == expectedValue;
      },
      notequal: function(value, expectedValue) {
        return value != expectedValue;
      },
      contains: function(value, expectedValue) {
        return value && value["indexOf"] && value.indexOf(expectedValue) > -1;
      },
      notcontains: function(value, expectedValue) {
        return (
          !value || !value["indexOf"] || value.indexOf(expectedValue) == -1
        );
      },
      greater: function(value, expectedValue) {
        return value > expectedValue;
      },
      less: function(value, expectedValue) {
        return value < expectedValue;
      },
      greaterorequal: function(value, expectedValue) {
        return value >= expectedValue;
      },
      lessorequal: function(value, expectedValue) {
        return value <= expectedValue;
      }
    };
    return Trigger.operatorsValue;
  }
  private conditionRunner: ConditionRunner;
  private usedNames: Array<string>;
  constructor() {
    super();
    this.usedNames = [];
    var self = this;
    this.registerFunctionOnPropertiesValueChanged(
      ["operator", "value", "name"],
      function() {
        self.oldPropertiesChanged();
      }
    );
    this.registerFunctionOnPropertyValueChanged("expression", function() {
      self.onExpressionChanged();
    });
  }
  public getType(): string {
    return "triggerbase";
  }
  public get operator(): string {
    return this.getPropertyValue("operator", "equal");
  }
  public set operator(value: string) {
    if (!value) return;
    value = value.toLowerCase();
    if (!Trigger.operators[value]) return;
    this.setPropertyValue("operator", value);
  }
  public get value(): any {
    return this.getPropertyValue("value", null);
  }
  public set value(val: any) {
    this.setPropertyValue("value", val);
  }
  public get name(): string {
    return this.getPropertyValue("name", "");
  }
  public set name(val: string) {
    this.setPropertyValue("name", val);
  }

  public get expression(): string {
    return this.getPropertyValue("expression", "");
  }
  public set expression(val: string) {
    this.setPropertyValue("expression", val);
  }
  public checkExpression(
    keys: any,
    values: HashTable<any>,
    properties: HashTable<any> = null
  ) {
    if (!this.isCheckRequired(keys)) return;
    if (!!this.conditionRunner) {
      this.perform(this.conditionRunner.run(values, properties));
    }
  }
  public check(value: any) {
    this.perform(Trigger.operators[this.operator](value, this.value));
  }
  private perform(triggerResult: boolean) {
    if (triggerResult) {
      this.onSuccess();
    } else {
      this.onFailure();
    }
  }
  protected onSuccess() {}
  protected onFailure() {}
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.oldPropertiesChanged();
  }
  private oldPropertiesChanged() {
    this.onExpressionChanged();
  }
  private onExpressionChanged() {
    this.usedNames = [];
    this.conditionRunner = null;
  }
  public buildExpression(): string {
    if (!this.name) return "";
    if (Helpers.isValueEmpty(this.value) && this.isRequireValue) return "";
    return (
      "{" +
      this.name +
      "} " +
      this.operator +
      " " +
      new Operand(this.value).toString()
    );
  }
  private isCheckRequired(keys: any): boolean {
    if (!keys) return false;
    this.buildUsedNames();
    for (var i = 0; i < this.usedNames.length; i++) {
      if (keys.hasOwnProperty(this.usedNames[i])) return true;
      //if (keys[this.usedNames[i]] != undefined) return true;
    }
    return false;
  }
  private buildUsedNames() {
    if (!!this.conditionRunner) return;
    var expression = this.expression;
    if (!expression) {
      expression = this.buildExpression();
    }
    if (!expression) return;
    this.conditionRunner = new ConditionRunner(expression);
    this.usedNames = this.conditionRunner.getVariables();
    var processValue = new ProcessValue();
    for (var i = 0; i < this.usedNames.length; i++) {
      this.usedNames[i] = processValue.getFirstName(this.usedNames[i]);
    }
  }
  private get isRequireValue(): boolean {
    return this.operator !== "empty" && this.operator != "notempty";
  }
}

export interface ISurveyTriggerOwner {
  getObjects(pages: string[], questions: string[]): any[];
  doComplete();
  setTriggerValue(name: string, value: any, isVariable: boolean);
}

/**
 * It extends the Trigger base class and add properties required for SurveyJS classes.
 */
export class SurveyTrigger extends Trigger {
  protected owner: ISurveyTriggerOwner = null;
  constructor() {
    super();
  }
  public setOwner(owner: ISurveyTriggerOwner) {
    this.owner = owner;
  }
  public get isOnNextPage() {
    return false;
  }
}
/**
 * If expression returns true, it makes questions/pages visible.
 * Ohterwise it makes them invisible.
 */
export class SurveyTriggerVisible extends SurveyTrigger {
  public pages: string[] = [];
  public questions: string[] = [];
  constructor() {
    super();
  }
  public getType(): string {
    return "visibletrigger";
  }
  protected onSuccess() {
    this.onTrigger(this.onItemSuccess);
  }
  protected onFailure() {
    this.onTrigger(this.onItemFailure);
  }
  private onTrigger(func: Function) {
    if (!this.owner) return;
    var objects = this.owner.getObjects(this.pages, this.questions);
    for (var i = 0; i < objects.length; i++) {
      func(objects[i]);
    }
  }
  protected onItemSuccess(item: any) {
    item.visible = true;
  }
  protected onItemFailure(item: any) {
    item.visible = false;
  }
}
/**
 * If expression returns true, it completes the survey.
 */
export class SurveyTriggerComplete extends SurveyTrigger {
  constructor() {
    super();
  }
  public getType(): string {
    return "completetrigger";
  }
  public get isOnNextPage() {
    return true;
  }
  protected onSuccess() {
    if (this.owner) this.owner.doComplete();
  }
}
export class SurveyTriggerSetValue extends SurveyTrigger {
  public setToName: string;
  public setValue: any;
  public isVariable: boolean;
  constructor() {
    super();
  }
  public getType(): string {
    return "setvaluetrigger";
  }
  protected onSuccess() {
    if (!this.setToName || !this.owner) return;
    this.owner.setTriggerValue(this.setToName, this.setValue, this.isVariable);
  }
}

JsonObject.metaData.addClass("trigger", [
  {name: "operator", default: "equal"},
  "value",
  "expression:condition"
]);
JsonObject.metaData.addClass("surveytrigger", ["name"], null, "trigger");
JsonObject.metaData.addClass(
  "visibletrigger",
  ["pages", "questions"],
  function() {
    return new SurveyTriggerVisible();
  },
  "surveytrigger"
);
JsonObject.metaData.addClass(
  "completetrigger",
  [],
  function() {
    return new SurveyTriggerComplete();
  },
  "surveytrigger"
);
JsonObject.metaData.addClass(
  "setvaluetrigger",
  ["!setToName", "setValue", "isVariable:boolean"],
  function() {
    return new SurveyTriggerSetValue();
  },
  "surveytrigger"
);
