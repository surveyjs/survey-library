import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { JsonObject } from "./jsonobject";
import { ConditionRunner, ExpressionRunner, Operand } from "./conditions";
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
      empty: function(value:any, expectedValue:any) {
        return !value;
      },
      notempty: function(value:any, expectedValue:any) {
        return !!value;
      },
      equal: function(value:any, expectedValue:any) {
        return value == expectedValue;
      },
      notequal: function(value:any, expectedValue:any) {
        return value != expectedValue;
      },
      contains: function(value:any, expectedValue:any) {
        return value && value["indexOf"] && value.indexOf(expectedValue) > -1;
      },
      notcontains: function(value:any, expectedValue:any) {
        return (
          !value || !value["indexOf"] || value.indexOf(expectedValue) == -1
        );
      },
      greater: function(value:any, expectedValue:any) {
        return value > expectedValue;
      },
      less: function(value:any, expectedValue:any) {
        return value < expectedValue;
      },
      greaterorequal: function(value:any, expectedValue:any) {
        return value >= expectedValue;
      },
      lessorequal: function(value:any, expectedValue:any) {
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
      this.perform(values, properties);
    }
  }
  public check(value: any) {
    var triggerResult = Trigger.operators[this.operator](value, this.value);
    if (triggerResult) {
      this.onSuccess({}, null);
    } else {
      this.onFailure();
    }
  }
  private perform(values: HashTable<any>, properties: HashTable<any>) {
    var triggerResult = this.conditionRunner.run(values, properties);
    if (triggerResult) {
      this.onSuccess(values, properties);
    } else {
      this.onFailure();
    }
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {}
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
  doComplete(): any;
  setTriggerValue(name: string, value: any, isVariable: boolean): any;
  copyTriggerValue(name: string, fromName: string): any;
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
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
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
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
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
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.setToName || !this.owner) return;
    this.owner.setTriggerValue(this.setToName, this.setValue, this.isVariable);
  }
}

export class SurveyTriggerRunExpression extends SurveyTrigger {
  public setToName: string;
  public runExpression: any;
  constructor() {
    super();
  }
  public getType(): string {
    return "runexpressiontrigger";
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.owner || !this.runExpression) return;
    var newValue = undefined;
    var expression = new ExpressionRunner(this.runExpression);
    if (expression.canRun) {
      newValue = expression.run(values, properties);
    }
    if (!this.setToName || newValue !== undefined) {
      this.owner.setTriggerValue(this.setToName, newValue, false);
    }
  }
}

export class SurveyTriggerCopyValue extends SurveyTrigger {
  public setToName: string;
  public fromName: any;
  constructor() {
    super();
  }
  public getType(): string {
    return "copyvaluetrigger";
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.setToName || !this.owner) return;
    this.owner.copyTriggerValue(this.setToName, this.fromName);
  }
}

JsonObject.metaData.addClass("trigger", [
  { name: "operator", default: "equal" },
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

JsonObject.metaData.addClass(
  "copyvaluetrigger",
  ["!setToName", "!fromName"],
  function() {
    return new SurveyTriggerCopyValue();
  },
  "surveytrigger"
);
JsonObject.metaData.addClass(
  "runExpressiontrigger",
  ["setToName", "runExpression"],
  function() {
    return new SurveyTriggerRunExpression();
  },
  "surveytrigger"
);
