import * as ko from "knockout";
import { QuestionExpressionModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionExpression extends QuestionExpressionModel {
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

Serializer.overrideClassCreator("expression", function() {
  return new QuestionExpression("");
});
QuestionFactory.Instance.registerQuestion("expression", name => {
  return new QuestionExpression(name);
});
