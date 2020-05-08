import * as ko from "knockout";
import { QuestionTextModel } from "../question_text";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

class QuestionTextImplementor extends QuestionImplementor {
  koTextRootClass = ko.pureComputed(() => {
    return (
      this.question.koCss().control +
      (this.question.errors.length > 0
        ? " " + this.question.koCss().onError
        : "")
    );
  });
  constructor(public question: Question) {
    super(question);
    (<any>question)["koTextRootClass"] = this.koTextRootClass;
  }
}
export class QuestionText extends QuestionTextModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionTextImplementor(this);
  }
}

Serializer.overrideClassCreator("text", function() {
  return new QuestionText("");
});

QuestionFactory.Instance.registerQuestion("text", name => {
  return new QuestionText(name);
});
