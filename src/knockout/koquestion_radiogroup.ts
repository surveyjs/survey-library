import * as ko from "knockout";
import { QuestionRadiogroupModel } from "../question_radiogroup";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";

export class QuestionRadiogroup extends QuestionRadiogroupModel {
  constructor(public name: string) {
    super(name);
    new QuestionCheckboxBaseImplementor(this);
  }
  getItemClass(item: any) {
    var itemClass = this.cssClasses.item;
    if (!this.hasColumns) {
      itemClass +=
        this.colCount === 0
          ? " " + this.cssClasses.itemInline
          : " sv-q-col-" + this.colCount;
    }
    if (this.isReadOnly || !item.isEnabled) itemClass += " " + this.cssClasses.itemDisabled;
    if (item.value === this.value) itemClass += " " + this.cssClasses.itemChecked;
    return itemClass;
  }
}

Serializer.overrideClassCreator("radiogroup", function() {
  return new QuestionRadiogroup("");
});

QuestionFactory.Instance.registerQuestion("radiogroup", name => {
  var q = new QuestionRadiogroup(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
