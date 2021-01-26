import * as ko from "knockout";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionRankingModel } from "../question_ranking";
import { QuestionImplementor } from "./koquestion";

export class QuestionRanking extends QuestionRankingModel {
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
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
