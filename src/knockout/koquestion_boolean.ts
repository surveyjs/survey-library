import * as ko from "knockout";
import { QuestionBooleanModel } from "../question_boolean";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionBooleanImplementor extends QuestionImplementor {
  constructor(public question: Question) {
    super(question);
  }
}

export class QuestionBoolean extends QuestionBooleanModel {
  constructor(public name: string) {
    super(name);
    new QuestionBooleanImplementor(this);
  }
  public getItemCss(row: any, column: any) {
    let isChecked = this.checkedValue;
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
