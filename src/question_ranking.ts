import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxModel } from "./question_checkbox";

/**
 * A Model for a ranking question
 */
export class QuestionRankingModel extends QuestionCheckboxModel {}

Serializer.addClass(
  "ranking",
  [{ name: "noneText", serializationProperty: "locNoneText" }],
  function () {
    return new QuestionRankingModel("");
  },
  "checkbox"
);
QuestionFactory.Instance.registerQuestion("ranking", (name) => {
  var q = new QuestionRankingModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
