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
        ? " sv_q_imagepicker_inline"
        : " sv-q-col-" + this.colCount);
    if (this.multiSelect) {
      if (!!this.value && this["koValue"]().indexOf(item.value) !== -1) {
        itemClass += " checked";
      }
    } else {
      if (!!item.value && item.value == this["koValue"]()) {
        itemClass += " checked";
      }
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
