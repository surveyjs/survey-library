import * as ko from "knockout";
import { QuestionBooleanModel } from "../question_boolean";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionBooleanImplementor extends QuestionImplementor {
  koIndeterminate: any;
  koCheckedValue: any;
  constructor(public question: Question) {
    super(question);
    this.koIndeterminate = ko.observable(
      (<QuestionBoolean>this.question).isIndeterminate
    );
    this.koCheckedValue = ko.observable(
      (<QuestionBoolean>this.question).checkedValue
    );
    var self = this;
    this.koCheckedValue.subscribe(function(newValue:any) {
      self.updateCheckedValue(newValue);
    });
    (<any>this.question)["koIndeterminate"] = this.koIndeterminate;
    (<any>this.question)["koCheckedValue"] = this.koCheckedValue;
  }
  protected setkoValue(newValue: any) {
    super.setkoValue(newValue);
    this.koIndeterminate((<QuestionBoolean>this.question).isIndeterminate);
    if (
      this.koCheckedValue() != (<QuestionBoolean>this.question).checkedValue
    ) {
      this.koCheckedValue((<QuestionBoolean>this.question).checkedValue);
    }
  }
  protected updateCheckedValue(newValue: any) {
    (<QuestionBoolean>this.question).checkedValue = newValue;
  }
  private isIndeterminate(): boolean {
    return !this.question.value && this.question.value !== false;
  }
}

export class QuestionBoolean extends QuestionBooleanModel {
  constructor(public name: string) {
    super(name);
    new QuestionBooleanImplementor(this);
  }
  public getItemCss(row:any, column:any) {
    let isChecked = (<any>this)["koCheckedValue"]();
    let itemClass = (<any>this)["koCss"]().item + (isChecked ? " checked" : "");
    return itemClass;
  }
}

JsonObject.metaData.overrideClassCreatore("boolean", function() {
  return new QuestionBoolean("");
});

QuestionFactory.Instance.registerQuestion("boolean", name => {
  return new QuestionBoolean(name);
});
