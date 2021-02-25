import * as ko from "knockout";
import { QuestionImagePickerModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { Question } from "survey-core";

class QuestionImagePickerImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected getKoValue() {
    return this.question.renderedValue;
  }
}

export class QuestionImagePicker extends QuestionImagePickerModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImagePickerImplementor(this);
  }
}

Serializer.overrideClassCreator("imagepicker", function () {
  return new QuestionImagePicker("");
});

QuestionFactory.Instance.registerQuestion("imagepicker", (name) => {
  var q = new QuestionImagePicker(name);
  //q.choices = QuestionFactory.DefaultChoices;
  return q;
});
