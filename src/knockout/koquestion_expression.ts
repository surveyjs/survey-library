import * as ko from "knockout";
import { QuestionExpressionModel } from "../question_expression";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionExpressionImplementor extends QuestionImplementor {
  koDisplayValue: any;
  constructor(public question: Question) {
    super(question);
    this.koDisplayValue = ko.observable(this.question.displayValue);
    (<any>this.question)["koDisplayValue"] = this.koDisplayValue;
    ko.computed(() => {
      this.koDisplayValue(this.question.displayValue);
    });
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
