import * as ko from "knockout";
import { QuestionSignaturePadModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionSignaturePad extends QuestionSignaturePadModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("signaturepad", function () {
  return new QuestionSignaturePad("");
});
