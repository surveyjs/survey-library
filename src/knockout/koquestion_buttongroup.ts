import { QuestionButtonGroupModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";

export class QuestionButtonGroup extends QuestionButtonGroupModel {
  private _implementor: QuestionCheckboxBaseImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionCheckboxBaseImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

// Serializer.overrideClassCreator("buttongroup", function() {
//   return new QuestionButtonGroup("");
// });

// QuestionFactory.Instance.registerQuestion("buttongroup", name => {
//   var q = new QuestionButtonGroup(name);
//   q.choices = QuestionFactory.DefaultChoices;
//   return q;
// });
