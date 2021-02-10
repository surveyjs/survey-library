import { ItemValue } from "../src/itemvalue";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRankingModel } from "../src/question_ranking";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question ranking");

QUnit.test("Ranking: Base ", function (assert) {
  const items = ["one", "two", "three"];
  const model = new QuestionRankingModel("test");

  model.moveArrayItemBack(items, 1);
  assert.deepEqual(items, ["two", "one", "three"], "moveArrayItemBack is ok");

  model.moveArrayItemForward(items, 0);
  assert.deepEqual(
    items,
    ["one", "two", "three"],
    "moveArrayItemForward is ok"
  );
});

//TODO need fix https://github.com/surveyjs/survey-library/issues/2648
QUnit.test("Ranking: Survey data", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
      },
    ],
  });
  survey.data = { q1: ["b", "a", "c"] };
  var q1 = <QuestionRankingModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, ["b", "a", "c"]);
  assert.deepEqual(q1.isIndeterminate, false);
  assert.deepEqual(
    q1.rankingChoices.map((item) => item.text),
    ["b", "a", "c"]
  );
});

QUnit.test("Ranking: Carry Forward", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
      {
        type: "ranking",
        name: "q2",
        choicesFromQuestion: "q1",
        choicesFromQuestionMode: "selected",
      },
    ],
  });
  var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  var q2 = <QuestionRankingModel>survey.getQuestionByName("q2");

  assert.deepEqual(q2.rankingChoices, []);

  q1.value = ["2", "3"];
  assert.deepEqual(
    q2.rankingChoices.map((item) => item.text),
    ["2", "3"]
  );
  q1.value = [];
  assert.deepEqual(
    q2.rankingChoices.map((item) => item.text),
    []
  );
});
