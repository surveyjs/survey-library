import * as ko from "knockout";
import { QuestionTextModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionText extends QuestionTextModel {
  private _implementor: QuestionImplementor;
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

Serializer.overrideClassCreator("text", function() {
  return new QuestionText("");
});

QuestionFactory.Instance.registerQuestion("text", name => {
  return new QuestionText(name);
});
