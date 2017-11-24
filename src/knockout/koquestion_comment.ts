import * as ko from "knockout";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCommentModel } from "../question_comment";
import { QuestionImplementor } from "./koquestion";

export class QuestionComment extends QuestionCommentModel {
  constructor(public name: string) {
    super(name);
    new QuestionImplementor(this);
  }
}

JsonObject.metaData.overrideClassCreatore("comment", function() {
  return new QuestionComment("");
});
QuestionFactory.Instance.registerQuestion("comment", name => {
  return new QuestionComment(name);
});
