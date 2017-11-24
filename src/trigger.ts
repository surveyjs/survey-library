import { HashTable } from "./helpers";
import { Base } from "./base";
import { JsonObject } from "./jsonobject";

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
  private opValue: string = "equal";
  public value: any;
  constructor() {
    super();
  }
  public getType(): string {
    return "triggerbase";
  }
  public get operator(): string {
    return this.opValue;
  }
  public set operator(value: string) {
    if (!value) return;
    value = value.toLowerCase();
    if (!Trigger.operators[value]) return;
    this.opValue = value;
  }
  public check(value: any) {
    if (Trigger.operators[this.operator](value, this.value)) {
      this.onSuccess();
    } else {
      this.onFailure();
    }
  }
  protected onSuccess() {}
  protected onFailure() {}
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
  public name: string;
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

JsonObject.metaData.addClass("trigger", ["operator", "!value"]);
JsonObject.metaData.addClass("surveytrigger", ["!name"], null, "trigger");
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
