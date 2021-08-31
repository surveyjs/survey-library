import { write } from "fs";
import * as ko from "knockout";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCommentModel, increaseHeightByContent } from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionComment extends QuestionCommentModel {
  private _implementor: QuestionImplementor;
  private onInput(_: any, event: any) {
    if (this.isInputTextUpdate)
      this.value = event.target.value;
    if (this.autoGrow)
      increaseHeightByContent(event.target);
  }
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose() {
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
