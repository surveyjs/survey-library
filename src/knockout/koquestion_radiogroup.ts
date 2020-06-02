import * as ko from "knockout";
import { QuestionRadiogroupModel } from "../question_radiogroup";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";

export class QuestionRadiogroup extends QuestionRadiogroupModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionCheckboxBaseImplementor(this);
  }
  getItemClass(item: any) {
    var itemClass = this.cssClasses.item;
    var isDisabled = this.isReadOnly || !item.isEnabled;
    var isChecked = item.value === this.value || this.isOtherSelected && this.otherItem.value === item.value;
    var allowHover = !isDisabled && !isChecked;
    if (!this.hasColumns) {
      itemClass +=
        this.colCount === 0
          ? " " + this.cssClasses.itemInline
          : " sv-q-col-" + this.colCount;
    }
    if (isDisabled) itemClass += " " + this.cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + this.cssClasses.itemChecked;
    if (allowHover) itemClass += " " + this.cssClasses.itemHover;
    return itemClass;
  }
  getLabelClass(item: any) {
    return super.getLabelClass(item.value === this.value);
  }
  getItemIndex(item: any) {
    return this.visibleChoices.indexOf(item);
  }
  getControlLabelClass(item: any) {
    return super.getControlLabelClass(item.value === this.value);
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
