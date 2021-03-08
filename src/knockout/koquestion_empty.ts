import * as ko from "knockout";
import { QuestionEmptyModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionEmpty extends QuestionEmptyModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("empty", function () {
  return new QuestionEmpty("");
});
