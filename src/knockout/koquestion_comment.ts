import * as ko from "knockout";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCommentModel } from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionComment extends QuestionCommentModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("comment", function () {
  return new QuestionComment("");
});
QuestionFactory.Instance.registerQuestion("comment", (name) => {
  return new QuestionComment(name);
});
