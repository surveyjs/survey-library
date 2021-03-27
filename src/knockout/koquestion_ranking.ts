import * as ko from "knockout";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionRankingModel } from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionRanking extends QuestionRankingModel {
  private _implementor: QuestionImplementor;
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("ranking", function() {
  return new QuestionRanking("");
});
QuestionFactory.Instance.registerQuestion("ranking", name => {
  var q = new QuestionRanking(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
