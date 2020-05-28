import * as ko from "knockout";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCommentModel } from "../question_comment";
import { QuestionImplementor } from "./koquestion";

export class QuestionComment extends QuestionCommentModel {
  constructor(public name: string) {
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
