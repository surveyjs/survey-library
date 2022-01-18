import { QuestionRatingModel } from "../src/question_rating";
import { SurveyModel } from "../src/survey";

QUnit.test("check allowhover class in design mode", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  const item = q1.visibleRateValues[0];
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") != -1);
  survey.setDesignMode(true);
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") == -1);
});

QUnit.test("check rating default items has owner and owner property name", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  const item = q1.visibleRateValues[0];
  assert.equal(item.locOwner, q1);
  assert.equal(item.ownerPropertyName, "rateValues");
});
