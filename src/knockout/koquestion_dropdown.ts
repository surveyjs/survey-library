import * as ko from "knockout";
import { QuestionDropdownModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionSelectBaseImplementor } from "./koquestion_baseselect";
import { Question } from "survey-core";

class QuestionDropdownImplementor extends QuestionSelectBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
}

export class QuestionDropdown extends QuestionDropdownModel {
  private _implementor: QuestionDropdownImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionDropdownImplementor(this);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}
Serializer.overrideClassCreator("dropdown", function() {
  return new QuestionDropdown("");
});
QuestionFactory.Instance.registerQuestion("dropdown", (name) => {
  var q = new QuestionDropdown(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
