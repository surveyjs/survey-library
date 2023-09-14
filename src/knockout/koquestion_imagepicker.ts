import * as ko from "knockout";
import { ItemValue, QuestionImagePickerModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { Question } from "survey-core";

class QuestionImagePickerImplementor extends QuestionCheckboxBaseImplementor {
  private koRecalc: any;
  constructor(public question: QuestionImagePicker) {
    super(question);
    this.koRecalc = ko.observable(0);
    this.setCallbackFunc("koGetItemClass", (item: ItemValue) => {
      this.koRecalc();
      return question.getItemClass(item);
    });
    this.question.registerFunctionOnPropertyValueChanged("value", () => {
      if(this.question.multiSelect && this.question.isDesignMode) {
        this.koRecalc(this.koRecalc() + 1);
      }
    }, "__koOnValueChangeTrigger");
  }
  protected getKoValue() {
    return this.question.renderedValue;
  }
  public dispose(): void {
    this.question.unRegisterFunctionOnPropertyValueChanged("value", "__koOnValueChangeTrigger");
    super.dispose();
  }
}

export class QuestionImagePicker extends QuestionImagePickerModel {
  private _implementor: QuestionImagePickerImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImagePickerImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
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
