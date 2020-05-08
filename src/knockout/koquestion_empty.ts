import * as ko from "knockout";
import { QuestionEmptyModel } from "../question_empty";
import { Serializer } from "../jsonobject";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionEmpty extends QuestionEmptyModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("empty", function() {
  return new QuestionEmpty("");
});
