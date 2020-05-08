import * as ko from "knockout";
import { QuestionExpressionModel } from "../question_expression";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionExpressionImplementor extends QuestionImplementor {
  constructor(public question: Question) {
    super(question);
  }
}

export class QuestionExpression extends QuestionExpressionModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionExpressionImplementor(this);
  }
}

Serializer.overrideClassCreator("expression", function() {
  return new QuestionExpression("");
});
QuestionFactory.Instance.registerQuestion("expression", name => {
  return new QuestionExpression(name);
});
