import * as ko from "knockout";
import { QuestionImagePickerModel } from "../question_imagepicker";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { Question } from "../question";

class QuestionImagePickerImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected getKoValue() {
    return this.question.renderedValue;
  }
}

export class QuestionImagePicker extends QuestionImagePickerModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImagePickerImplementor(this);
  }
  getItemClass(item: any) {
    var itemClass =
      this.cssClasses.item +
      (this.colCount === 0
        ? " " + this.cssClasses.itemInline
        : " sv-q-col-" + this.colCount);
    var isChecked = this.isItemSelected(item);
    var isDisabled = this.isReadOnly || !item.isEnabled;
    var allowHover = !isChecked && !isDisabled;
    if (isChecked) {
      itemClass += " " + this.cssClasses.itemChecked;
    }
    if (isDisabled) {
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
