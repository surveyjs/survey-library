import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { ISurvey } from "./base-interfaces";
import { Serializer } from "./jsonobject";
import { ConditionRunner, ExpressionRunner } from "./conditions";
import { OperandMaker } from "./expressions/expressions";
import { ValueGetter } from "./conditionProcessValue";
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
      empty: function(value: any, expectedValue: any) {
        return !value;
      },
      notempty: function(value: any, expectedValue: any) {
        return !!value;
      },
      equal: function(value: any, expectedValue: any) {
        return value == expectedValue;
      },
      notequal: function(value: any, expectedValue: any) {
        return value != expectedValue;
      },
      contains: function(value: any, expectedValue: any) {
        return value && value["indexOf"] && value.indexOf(expectedValue) > -1;
      },
      notcontains: function(value: any, expectedValue: any) {
        return (
          !value || !value["indexOf"] || value.indexOf(expectedValue) == -1
        );
      },
      greater: function(value: any, expectedValue: any) {
        return value > expectedValue;
      },
      less: function(value: any, expectedValue: any) {
        return value < expectedValue;
      },
      greaterorequal: function(value: any, expectedValue: any) {
        return value >= expectedValue;
      },
      lessorequal: function(value: any, expectedValue: any) {
        return value <= expectedValue;
      },
    };
    return Trigger.operatorsValue;
  }
  constructor() {
    super();
  }
  public get id(): number { return this.uniqueId; }
  public getType(): string {
    return "triggerbase";
  }
  public toString(): string {
    var res = this.getType().replace("trigger", "");
    var exp = this.expression;
    if (exp) {
      res += ", " + exp;
    }
    return res;
  }
  public isGhost: boolean;
  protected get isInternal(): boolean {
    return this.isGhost === true;
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
    return this.getPropertyValue("expression", this.buildExpression());
  }
  public set expression(val: string) {
    this.setPropertyValue("expression", val);
  }
  protected canBeExecuted(isOnNextPage: boolean): boolean {
    return true;
  }
  protected canBeExecutedOnComplete(): boolean {
    return false;
  }
  protected isExecutingOnNextPage: boolean;
  protected isExecutingOnNavigation: boolean;
  public checkExpression(options: { isOnNextPage: boolean, isOnComplete: boolean, isOnNavigation: boolean,
    keys: any, properties?: HashTable<any>, }): void {
    this.isExecutingOnNextPage = options.isOnNextPage;
    this.isExecutingOnNavigation = options.isOnNavigation || options.isOnNextPage;
    if (!this.canBeExecuted(options.isOnNextPage)) return;
    if (options.isOnComplete && !this.canBeExecutedOnComplete()) return;
    const keys = Object.keys(options.keys);
    if (Array.isArray(keys) && !this.canBeExecuteOnKeysChange(keys)) return;
    const props = options.properties || null;
    if (!this.runExpressionByProperty("expression", props, (val: any) => {
      this.triggerResult(val === true, props);
    }, (runner: ExpressionRunner): boolean => {
      return this.isCheckRequired(runner, options.keys);
    })) {
      if (this.isCheckRequired(null, options.keys) && this.canSuccessOnEmptyExpression()) {
        this.triggerResult(true, props);
      }
    }
  }
  protected canBeExecuteOnKeysChange(keys: any[]) {
    return true;
  }
  protected canSuccessOnEmptyExpression(): boolean { return false; }
  public check(value: any): void {
    var triggerResult = Trigger.operators[this.operator](value, this.value);
    if (triggerResult) {
      this.onSuccess(null);
    } else {
      this.onFailure();
    }
  }
  public get requireValidQuestion(): boolean { return false; }
  private triggerResult(res: boolean, properties: HashTable<any>
  ) {
    if (res) {
      this.onSuccess(properties);
      this.onSuccessExecuted();
    } else {
      this.onFailure();
    }
  }
  protected onSuccess(properties: HashTable<any>): void {}
  protected onFailure(): void {}
  protected onSuccessExecuted(): void {}
  private buildExpression(): string {
    if (!this.name) return "";
    if (this.isValueEmpty(this.value) && this.isRequireValue) return "";
    return (
      "{" +
      this.name +
      "} " +
      this.operator +
      " " +
      OperandMaker.toOperandString(this.value)
    );
  }
  private isCheckRequired(runner: ExpressionRunner, keys: any): boolean {
    if (!keys) return false;
    if (runner?.hasFunction() === true) return true;
    return new ValueGetter().isAnyKeyChanged(keys, this.getUsedVariables(runner));
  }
  protected getUsedVariables(runner: ExpressionRunner): string[] {
    if (!runner) return [];
    const res = runner.getVariables();
    if (Array.isArray(res)) {
      const unw = settings.expressionVariables.unwrapPostfix;
      for (let i = res.length - 1; i >= 0; i--) {
        const s = res[i];
        if (s.endsWith(unw)) {
          res.push(s.substring(0, s.length - unw.length));
        }
      }
    }
    return res;
  }
  private get isRequireValue(): boolean {
    return this.operator !== "empty" && this.operator != "notempty";
  }
}

export interface ISurveyTriggerOwner {
  getObjects(pages: string[], questions: string[]): any[];
  setCompleted(trigger: Trigger): void;
  canBeCompleted(trigger: Trigger, isCompleted: boolean): void;
  triggerExecuted(trigger: Trigger): void;
  setTriggerValue(name: string, value: any, isVariable: boolean): any;
  copyTriggerValue(name: string, fromName: string, copyDisplayValue: boolean): void;
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
  public getOwner() {
    return this.owner;
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.owner && !!(<any>this.owner)["getSurvey"]
      ? (<any>this.owner).getSurvey()
      : null;
  }
  protected isRealExecution(): boolean {
    return true;
  }
  protected onSuccessExecuted(): void {
    if (!!this.owner && this.isRealExecution()) {
      this.owner.triggerExecuted(this);
    }
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
  protected onSuccess(properties: HashTable<any>) {
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
  public get requireValidQuestion(): boolean { return true; }
  protected isRealExecution(): boolean {
    return !settings.triggers.executeCompleteOnValueChanged === this.isExecutingOnNavigation;
  }
  protected onSuccess(properties: HashTable<any>): void {
    if (!this.owner) return;
    if (this.isRealExecution()) {
      this.owner.setCompleted(this);
    } else {
      this.owner.canBeCompleted(this, true);
    }
  }
  protected onFailure(): void {
    this.owner.canBeCompleted(this, false);
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
  protected canBeExecuted(isOnNextPage: boolean): boolean {
    return !isOnNextPage && !!this.setToName;
  }
  protected canBeExecuteOnKeysChange(keys: any[]) {
    if (keys.length === 1 && keys[0] === this.setToName) return false;
    return super.canBeExecuteOnKeysChange(keys);
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name !== "setToName") return;
    var survey = this.getSurvey();
    if (survey && !survey.isLoadingFromJson && survey.isDesignMode) {
      this.setValue = undefined;
    }
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
    return this.getPropertyValue("isVariable");
  }
  public set isVariable(val: boolean) {
    this.setPropertyValue("isVariable", val);
  }
  protected onSuccess(properties: HashTable<any>) {
    if (!this.setToName || !this.owner) return;
    this.owner.setTriggerValue(this.setToName, Helpers.getUnbindValue(this.setValue), this.isVariable);
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
  public get requireValidQuestion(): boolean { return this.canBeExecuted(false); }
  public get gotoName(): string {
    return this.getPropertyValue("gotoName", "");
  }
  public set gotoName(val: string) {
    this.setPropertyValue("gotoName", val);
  }
  protected canBeExecuted(isOnNextPage: boolean): boolean {
    return isOnNextPage === !settings.triggers.executeSkipOnValueChanged;
  }
  protected onSuccess(properties: HashTable<any>) {
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
  protected canBeExecuted(isOnNextPage: boolean): boolean {
    return !isOnNextPage;
  }
  protected onSuccess(properties: HashTable<any>): boolean {
    if (!this.owner) return;
    this.runExpressionByProperty("runExpression", properties, (res) => {
      this.onCompleteRunExpression(res);
    });
  }
  private onCompleteRunExpression(newValue: any) {
    if (!!this.setToName && newValue !== undefined) {
      this.owner.setTriggerValue(this.setToName, Helpers.convertValToQuestionVal(newValue), false);
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
  protected canBeExecuted(isOnNextPage: boolean): boolean {
    return !isOnNextPage && !!this.setToName && !!this.fromName;
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
  public get copyDisplayValue(): boolean {
    return this.getPropertyValue("copyDisplayValue");
  }
  public set copyDisplayValue(val: boolean) {
    this.setPropertyValue("copyDisplayValue", val);
  }
  public getType(): string {
    return "copyvaluetrigger";
  }
  protected canBeExecuteOnKeysChange(keys: any[]) {
    if (keys.length === 1 && keys[0] === this.setToName) return false;
    return super.canBeExecuteOnKeysChange(keys);
  }
  protected onSuccess(properties: HashTable<any>): void {
    if (!this.setToName || !this.owner) return;
    this.owner.copyTriggerValue(this.setToName, this.fromName, this.copyDisplayValue);
  }
  protected canSuccessOnEmptyExpression(): boolean { return true; }
  protected getUsedVariables(runner: ExpressionRunner): string[] {
    const res = super.getUsedVariables(runner);
    if (res.length === 0 && !!this.fromName) {
      res.push(this.fromName);
    }
    return res;
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
  function() {
    return new SurveyTriggerVisible();
  },
  "surveytrigger"
);
Serializer.addClass(
  "completetrigger",
  [],
  function() {
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
      visibleIf: function(obj: any) {
        return !!obj && !!obj["setToName"];
      },
    },
    { name: "isVariable:boolean", visible: false },
  ],
  function() {
    return new SurveyTriggerSetValue();
  },
  "surveytrigger"
);
Serializer.addClass(
  "copyvaluetrigger",
  [{ name: "!fromName:questionvalue" }, { name: "!setToName:questionvalue" },
    { name: "copyDisplayValue:boolean", visible: false }],
  function() {
    return new SurveyTriggerCopyValue();
  },
  "surveytrigger"
);
Serializer.addClass(
  "skiptrigger",
  [{ name: "!gotoName:question" }],
  function() {
    return new SurveyTriggerSkip();
  },
  "surveytrigger"
);
Serializer.addClass(
  "runexpressiontrigger",
  [{ name: "setToName:questionvalue" }, "runExpression:expression"],
  function() {
    return new SurveyTriggerRunExpression();
  },
  "surveytrigger"
);
