import * as ko from "knockout";
import { QuestionExpressionModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionExpressionImplementor extends QuestionImplementor {
  constructor(public question: Question) {
    super(question);
  }
}

export class QuestionExpression extends QuestionExpressionModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionExpressionImplementor(this);
  }
}

Serializer.overrideClassCreator("expression", function () {
  return new QuestionExpression("");
});
QuestionFactory.Instance.registerQuestion("expression", (name) => {
  return new QuestionExpression(name);
});
