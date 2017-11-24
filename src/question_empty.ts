import { JsonObject } from "./jsonobject";
import { Question } from "./question";

/**
 * A Model for an question that renders empty "div" tag. It used as a base class for some custom widgets
 */
export class QuestionEmptyModel extends Question {
  constructor(public name: string) {
    super(name);
  }
  public getType(): string {
    return "empty";
  }
}

JsonObject.metaData.addClass(
  "empty",
  [],
  function() {
    return new QuestionEmptyModel("");
  },
  "question"
);
