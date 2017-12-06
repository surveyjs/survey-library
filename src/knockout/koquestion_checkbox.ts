import * as ko from "knockout";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxModel } from "../question_checkbox";
import { Question } from "../question";

class QuestionCheckboxImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected createkoValue(): any {
    return this.question.value
      ? ko.observableArray(this.question.value)
      : ko.observableArray();
  }
  protected setkoValue(newValue: any) {
    if (newValue) {
      this.koValue([].concat(newValue));
    } else {
      this.koValue([]);
    }
  }
}
export class QuestionCheckbox extends QuestionCheckboxModel {
  constructor(public name: string) {
    super(name);
    new QuestionCheckboxImplementor(this);
  }
  getItemClass(item) {
    var isChecked = this["koValue"]() && this["koValue"]().indexOf(item.value) !== -1;
    var itemClass =
      this.cssClasses.item +
      (this.colCount === 0 ? " sv_q_checkbox_inline" : "");

    if (isChecked) itemClass += " checked";

    return itemClass;
  }
}

JsonObject.metaData.overrideClassCreatore("checkbox", function() {
  return new QuestionCheckbox("");
});
QuestionFactory.Instance.registerQuestion("checkbox", name => {
  var q = new QuestionCheckbox(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
