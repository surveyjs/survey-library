import * as ko from "knockout";
import { ItemValue, QuestionDropdownModel } from "survey-core";
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
  public koDisableOption: any;
  constructor(name: string) {
    super(name);
    this.koDisableOption = (option: any, item: ItemValue) => {
      if(!item) return;
      ko.applyBindingsToNode(option, { disable: ko.computed(() => { return !item.isEnabled; }) }, item);
    };
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionDropdownImplementor(this);
  }
  public dispose(): void {
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
