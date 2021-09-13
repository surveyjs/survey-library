import { write } from "fs";
import * as ko from "knockout";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCommentModel } from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionComment extends QuestionCommentModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating(): void {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("comment", function () {
  return new QuestionComment("");
});
QuestionFactory.Instance.registerQuestion("comment", name => {
  return new QuestionComment(name);
});
