import * as ko from "knockout";
import { QuestionSignaturePadModel } from "../question_signaturepad";
import { Serializer } from "../jsonobject";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionSignaturePad extends QuestionSignaturePadModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("signaturepad", function() {
  return new QuestionSignaturePad("");
});
