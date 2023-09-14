import * as ko from "knockout";
import { QuestionEmptyModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionEmpty extends QuestionEmptyModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("empty", function() {
  return new QuestionEmpty("");
});
