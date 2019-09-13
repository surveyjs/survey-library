import * as ko from "knockout";
import { QuestionBooleanModel } from "../question_boolean";
import { Serializer } from "../jsonobject";
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
    let isDisabled = this.isReadOnly;
    let allowHover = !isChecked && !isDisabled;
    let itemClass = this.cssClasses.item;
    if (isDisabled) itemClass += " " + this.cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + this.cssClasses.itemChecked;
    else if (isChecked === null)
      itemClass += " " + this.cssClasses.itemIndeterminate;
    if (allowHover) itemClass += " " + this.cssClasses.itemHover;
    return itemClass;
  }
}

Serializer.overrideClassCreator("boolean", function() {
  return new QuestionBoolean("");
});

QuestionFactory.Instance.registerQuestion("boolean", name => {
  return new QuestionBoolean(name);
});
