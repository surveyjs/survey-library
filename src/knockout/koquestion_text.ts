import { QuestionTextModel } from "../question_text";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";

export class QuestionText extends QuestionTextModel {
  constructor(public name: string) {
    super(name);
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("text", function() {
  return new QuestionText("");
});

QuestionFactory.Instance.registerQuestion("text", name => {
  return new QuestionText(name);
});
