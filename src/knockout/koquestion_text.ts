import * as ko from "knockout";
import { QuestionTextModel } from "../question_text";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

class QuestionTextImplementor extends QuestionImplementor {
  constructor(public question: Question) {
    super(question);
  }
}
export class QuestionText extends QuestionTextModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionTextImplementor(this);
  }
}

Serializer.overrideClassCreator("text", function () {
  return new QuestionText("");
});

QuestionFactory.Instance.registerQuestion("text", (name) => {
  return new QuestionText(name);
});
