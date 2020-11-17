import { QuestionRadiogroupModel } from "../question_radiogroup";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";

export class QuestionRadiogroup extends QuestionRadiogroupModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionCheckboxBaseImplementor(this);
  }
}

Serializer.overrideClassCreator("radiogroup", function () {
  return new QuestionRadiogroup("");
});

QuestionFactory.Instance.registerQuestion("radiogroup", (name) => {
  var q = new QuestionRadiogroup(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
