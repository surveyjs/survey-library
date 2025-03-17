import { Serializer } from "./jsonobject";
import { QuestionRatingModel } from "./question_rating";
import { QuestionFactory } from "./questionfactory";

/**
 * A class that describes the Range Slider question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/... (linkStyle))
 */
export class QuestionRangeSlider extends QuestionRatingModel {
}

Serializer.addClass(
  "rangeslider",
  [],
  function () {
    return new QuestionRangeSlider("");
  },
  "question" // ? maybe rating ?
);
QuestionFactory.Instance.registerQuestion("rangeslider", (name) => {
  return new QuestionRatingModel(name);
});
