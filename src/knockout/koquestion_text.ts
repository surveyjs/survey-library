import * as ko from "knockout";
import { QuestionTextModel } from "../question_text";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
import { Helpers } from "../helpers";

export class QuestionTextImplementor extends QuestionImplementor {
  constructor(public question: Question) {
    super(question);
  }
  protected updateValue(newValue: any) {
    super.updateValue(newValue);
    if (!Helpers.isTwoValueEquals(newValue, this.question.value)) {
      this.koValue(this.question.value);
    }
  }
}

export class QuestionText extends QuestionTextModel {
  constructor(public name: string) {
    super(name);
    new QuestionTextImplementor(this);
  }
}

JsonObject.metaData.overrideClassCreatore("text", function() {
  return new QuestionText("");
});

QuestionFactory.Instance.registerQuestion("text", name => {
  return new QuestionText(name);
});
