import * as ko from "knockout";
import { QuestionCheckboxImplementor } from "./koquestion_checkbox";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionRankingModel } from "../question_ranking";

export class QuestionRanking extends QuestionRankingModel {
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionCheckboxImplementor(this);
  }
}

Serializer.overrideClassCreator("ranking", function () {
  return new QuestionRanking("");
});
QuestionFactory.Instance.registerQuestion("ranking", (name) => {
  var q = new QuestionRanking(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
