import * as ko from "knockout";
import { QuestionImagePickerModel } from "../question_imagepicker";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { Question } from "../question";
import { Helpers } from "../helpers";

class QuestionImagePickerImplementor extends QuestionCheckboxBaseImplementor {
  private _koValue = ko.observableArray<any>();

  constructor(question: Question) {
    super(question);
    this._koValue.subscribe(newValue => {
      this.question.value = newValue;
    });
    Object.defineProperty(this.question, "koValue", {
      get: () => {
        if (!Helpers.isTwoValueEquals(this._koValue(), this.question.value)) {
          if(this.question.multiSelect) {
            this._koValue(this.question.value || []);
          } else {
            this._koValue(this.question.value);
          }
        }
        return this._koValue;
      },
      set: (newValue: Array<any> | KnockoutObservableArray<any> | any) => {
        if(this.question.multiSelect) {
          var newVal = [].concat(ko.unwrap(newValue));
          this.question.value = newVal;
        } else {
          this.question.value = ko.unwrap(newValue);
        }
      },
      enumerable: true,
      configurable: true
    });
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
      if (!!item.value && item.value === this["koValue"]()) {
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
