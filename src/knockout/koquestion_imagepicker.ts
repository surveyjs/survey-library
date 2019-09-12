import * as ko from "knockout";
import { QuestionImagePickerModel } from "../question_imagepicker";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";

export class QuestionImagePicker extends QuestionImagePickerModel {
  constructor(public name: string) {
    super(name);
    new QuestionCheckboxBaseImplementor(this);
  }
  getItemClass(item: any) {
    var itemClass =
      this.cssClasses.item +
      (this.colCount === 0
        ? " " + this.cssClasses.itemInline
        : " sv-q-col-" + this.colCount);
    var isChecked = this.multiSelect
      ? !!this.value && this["koValue"]().indexOf(item.value) !== -1
      : !!item.value && item.value == this["koValue"]();
    var allowHover = !isChecked && !this.isReadOnly;
    if (isChecked) {
      itemClass += " " + this.cssClasses.itemChecked;
    }
    if (this.isReadOnly || !item.isEnabled) {
      itemClass += " " + this.cssClasses.itemDisabled;
    }
    if (allowHover) {
      itemClass += " " + this.cssClasses.itemHover;
    }
    return itemClass;
  }
}

Serializer.overrideClassCreator("imagepicker", function() {
  return new QuestionImagePicker("");
});

QuestionFactory.Instance.registerQuestion("imagepicker", name => {
  var q = new QuestionImagePicker(name);
  //q.choices = QuestionFactory.DefaultChoices;
  return q;
});
