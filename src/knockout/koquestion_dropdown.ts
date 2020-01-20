import * as ko from "knockout";
import { QuestionDropdownModel } from "../question_dropdown";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionSelectBaseImplementor } from "./koquestion_baseselect";
import { Question } from "../question";

class QuestionDropdownImplementor extends QuestionSelectBaseImplementor {
  koControlClass = ko.pureComputed(() => {
    return (
      this.question.koCss().control +
      (this.question.errors.length > 0
        ? " " + this.question.koCss().onError
        : "")
    );
  });
  constructor(question: Question) {
    super(question);
    (<any>this.question)["koControlClass"] = this.koControlClass;
  }
}

export class QuestionDropdown extends QuestionDropdownModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionDropdownImplementor(this);
  }
}
Serializer.overrideClassCreator("dropdown", function() {
  return new QuestionDropdown("");
});
QuestionFactory.Instance.registerQuestion("dropdown", name => {
  var q = new QuestionDropdown(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
