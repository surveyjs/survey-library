import * as ko from "knockout";
import { QuestionDropdownModel } from "../question_dropdown";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionSelectBaseImplementor } from "./koquestion_baseselect";

export class QuestionDropdown extends QuestionDropdownModel {
  constructor(public name: string) {
    super(name);
    new QuestionSelectBaseImplementor(this);
  }
}

JsonObject.metaData.overrideClassCreatore("dropdown", function() {
  return new QuestionDropdown("");
});
QuestionFactory.Instance.registerQuestion("dropdown", name => {
  var q = new QuestionDropdown(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
