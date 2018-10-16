import * as ko from "knockout";
import { QuestionImagePickerModel } from "../question_imagepicker";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";

class QuestionImagePickerImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: QuestionImagePicker) {
    super(question);
  }
  protected createkoValue(): any {
    if (!(<QuestionImagePickerModel>this.question).multiSelect) {
      return ko.observable(this.question.value);
    }
    return this.question.value
      ? ko.observableArray(this.question.value)
      : ko.observableArray();
  }
  protected setkoValue(newValue: any) {
    if (!(<QuestionImagePickerModel>this.question).multiSelect) {
      this.koValue(newValue);
    } else {
      if (newValue) {
        this.koValue([].concat(newValue));
      } else {
        this.koValue([]);
      }
    }
  }
}

export class QuestionImagePicker extends QuestionImagePickerModel {
  constructor(public name: string) {
    super(name);
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    new QuestionImagePickerImplementor(this);
  }
  getItemClass(item:any) {
    var itemClass =
      this.cssClasses.item +
      (this.colCount === 0
        ? " sv_q_imagepicker_inline"
        : " sv-q-col-" + this.colCount);
    if (this.multiSelect) {
      if (!!(<any>this)["koValue"]() && (<any>this)["koValue"]().indexOf(item.value) !== -1) {
        itemClass += " checked";
      }
    } else {
      if (!!item.value && item.value === (<any>this)["koValue"]()) {
        itemClass += " checked";
      }
    }
    return itemClass;
  }
}

JsonObject.metaData.overrideClassCreatore("imagepicker", function() {
  return new QuestionImagePicker("");
});

QuestionFactory.Instance.registerQuestion("imagepicker", name => {
  var q = new QuestionImagePicker(name);
  //q.choices = QuestionFactory.DefaultChoices;
  return q;
});
