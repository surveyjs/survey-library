import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { Serializer } from "./jsonobject";
import { ConditionRunner, ExpressionRunner } from "./conditions";
import { OperandMaker } from "./expressions/expressions";
import { ProcessValue } from "./conditionProcessValue";
import { settings } from "./settings";

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
      empty: function (value: any, expectedValue: any) {
        return !value;
      },
      notempty: function (value: any, expectedValue: any) {
        return !!value;
      },
      equal: function (value: any, expectedValue: any) {
        return value == expectedValue;
      },
      notequal: function (value: any, expectedValue: any) {
        return value != expectedValue;
      },
      contains: function (value: any, expectedValue: any) {
        return value && value["indexOf"] && value.indexOf(expectedValue) > -1;
      },
      notcontains: function (value: any, expectedValue: any) {
        return (
          !value || !value["indexOf"] || value.indexOf(expectedValue) == -1
        );
      },
      greater: function (value: any, expectedValue: any) {
        return value > expectedValue;
      },
      less: function (value: any, expectedValue: any) {
        return value < expectedValue;
      },
      greaterorequal: function (value: any, expectedValue: any) {
        return value >= expectedValue;
      },
      lessorequal: function (value: any, expectedValue: any) {
        return value <= expectedValue;
      },
    };
    return Trigger.operatorsValue;
  }
  private conditionRunner: ConditionRunner;
  private usedNames: Array<string>;
  private hasFunction: boolean;
  constructor() {
    super();
    this.usedNames = [];
    var self = this;
    this.registerFunctionOnPropertiesValueChanged(
      ["operator", "value", "name"],
      function () {
        self.oldPropertiesChanged();
      }
    );
    this.registerFunctionOnPropertyValueChanged("expression", function () {
      self.onExpressionChanged();
    });
  }
  public getType(): string {
    return "triggerbase";
  }
  public toString(): string {
    var res = this.getType().replace("trigger", "");
    var exp = !!this.expression ? this.expression : this.buildExpression();
    if (exp) {
      res += ", " + exp;
    }
    return res;
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
    this.conditionRunner.onRunComplete = (res: boolean) => {
      this.triggerResult(res, values, properties);
    };
    this.conditionRunner.run(values, properties);
  }
  private triggerResult(
    res: boolean,
    values: HashTable<any>,
    properties: HashTable<any>
  ) {
    if (res) {
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
    this.hasFunction = false;
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
      OperandMaker.toOperandString(this.value)
    );
  }
  private isCheckRequired(keys: any): boolean {
    if (!keys) return false;
    this.buildUsedNames();
    if (this.hasFunction === true) return true;
    for (var i = 0; i < this.usedNames.length; i++) {
      if (keys.hasOwnProperty(this.usedNames[i])) return true;
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
    this.hasFunction = this.conditionRunner.hasFunction();
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
  setCompleted(): any;
  setTriggerValue(name: string, value: any, isVariable: boolean): any;
  copyTriggerValue(name: string, fromName: string): any;
  focusQuestion(name: string): boolean;
}

/**
 * It extends the Trigger base class and add properties required for SurveyJS classes.
 */
export class SurveyTrigger extends Trigger {
  protected ownerValue: ISurveyTriggerOwner = null;
  constructor() {
    super();
  }
  public get owner(): ISurveyTriggerOwner {
    return this.ownerValue;
  }
  public setOwner(owner: ISurveyTriggerOwner) {
    this.ownerValue = owner;
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
    return !settings.executeCompleteTriggerOnValueChanged;
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (this.owner) this.owner.setCompleted();
  }
}
/**
 * If expression returns true, the value from property **setValue** will be set to **setToName**
 */
export class SurveyTriggerSetValue extends SurveyTrigger {
  constructor() {
    super();
  }
  public getType(): string {
    return "setvaluetrigger";
  }
  public get setToName(): string {
    return this.getPropertyValue("setToName", "");
  }
  public set setToName(val: string) {
    this.setPropertyValue("setToName", val);
  }
  public get setValue(): any {
    return this.getPropertyValue("setValue");
  }
  public set setValue(val: any) {
    this.setPropertyValue("setValue", val);
  }
  public get isVariable(): boolean {
    return this.getPropertyValue("isVariable", false);
  }
  public set isVariable(val: boolean) {
    this.setPropertyValue("isVariable", val);
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.setToName || !this.owner) return;
    this.owner.setTriggerValue(this.setToName, this.setValue, this.isVariable);
  }
}
/**
 * If expression returns true, the survey go to question **gotoName** and focus it.
 */
export class SurveyTriggerSkip extends SurveyTrigger {
  constructor() {
    super();
  }
  public getType(): string {
    return "skiptrigger";
  }
  public get gotoName(): string {
    return this.getPropertyValue("gotoName", "");
  }
  public set gotoName(val: string) {
    this.setPropertyValue("gotoName", val);
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.gotoName || !this.owner) return;
    this.owner.focusQuestion(this.gotoName);
  }
}
/**
 * If expression returns true, the **runExpression** will be run. If **setToName** property is not empty then the result of **runExpression** will be set to it.
 */
export class SurveyTriggerRunExpression extends SurveyTrigger {
  constructor() {
    super();
  }
  public getType(): string {
    return "runexpressiontrigger";
  }
  public get setToName(): string {
    return this.getPropertyValue("setToName", "");
  }
  public set setToName(val: string) {
    this.setPropertyValue("setToName", val);
  }
  public get runExpression(): string {
    return this.getPropertyValue("runExpression", "");
  }
  public set runExpression(val: string) {
    this.setPropertyValue("runExpression", val);
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.owner || !this.runExpression) return;
    var expression = new ExpressionRunner(this.runExpression);
    if (expression.canRun) {
      expression.onRunComplete = (res) => {
        this.onCompleteRunExpression(res);
      };
      expression.run(values, properties);
    }
  }
  private onCompleteRunExpression(newValue: any) {
    if (!this.setToName || newValue !== undefined) {
      this.owner.setTriggerValue(this.setToName, newValue, false);
    }
  }
}

/**
 * If expression returns true, the value from question **fromName** will be set into **setToName**.
 */
export class SurveyTriggerCopyValue extends SurveyTrigger {
  constructor() {
    super();
  }
  public get setToName(): string {
    return this.getPropertyValue("setToName", "");
  }
  public set setToName(val: string) {
    this.setPropertyValue("setToName", val);
  }
  public get fromName(): string {
    return this.getPropertyValue("fromName", "");
  }
  public set fromName(val: string) {
    this.setPropertyValue("fromName", val);
  }
  public getType(): string {
    return "copyvaluetrigger";
  }
  protected onSuccess(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.setToName || !this.owner) return;
    this.owner.copyTriggerValue(this.setToName, this.fromName);
  }
}

Serializer.addClass("trigger", [
  { name: "operator", default: "equal", visible: false },
  { name: "value", visible: false },
  "expression:condition",
]);
Serializer.addClass(
  "surveytrigger",
  [{ name: "name", visible: false }],
  null,
  "trigger"
);
Serializer.addClass(
  "visibletrigger",
  ["pages:pages", "questions:questions"],
  function () {
    return new SurveyTriggerVisible();
  },
  "surveytrigger"
);
Serializer.addClass(
  "completetrigger",
  [],
  function () {
    return new SurveyTriggerComplete();
  },
  "surveytrigger"
);
Serializer.addClass(
  "setvaluetrigger",
  [
    { name: "!setToName:questionvalue" },
    {
      name: "setValue:triggervalue",
      dependsOn: "setToName",
      visibleIf: function (obj: any) {
        return !!obj && !!obj["setToName"];
      },
    },
    { name: "isVariable:boolean", visible: false },
  ],
  function () {
    return new SurveyTriggerSetValue();
  },
  "surveytrigger"
);
Serializer.addClass(
  "copyvaluetrigger",
  [{ name: "!setToName:questionvalue" }, { name: "!fromName:questionvalue" }],
  function () {
    return new SurveyTriggerCopyValue();
  },
  "surveytrigger"
);
Serializer.addClass(
  "skiptrigger",
  [{ name: "!gotoName:question" }],
  function () {
    return new SurveyTriggerSkip();
  },
  "surveytrigger"
);
Serializer.addClass(
  "runexpressiontrigger",
  [{ name: "setToName:questionvalue" }, "runExpression:expression"],
  function () {
    return new SurveyTriggerRunExpression();
  },
  "surveytrigger"
);
