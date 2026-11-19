import { Serializer } from "./jsonobject";
import { Question } from "./question";

export class QuestionEmptyModel extends Question {
  public hasDisplayTexts(): boolean { return false; }
  constructor(name: string) {
    super(name);
  }
  public getType(): string {
    return "empty";
  }
}

Serializer.addClass(
  "empty",
  [],
  function () {
    return new QuestionEmptyModel("");
  },
  "question"
);
