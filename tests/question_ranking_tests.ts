import { ItemValue } from "../src/itemvalue";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRankingModel } from "../src/question_ranking";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question ranking");

QUnit.test("Ranking: Base ", function(assert) {
  const items = ["one", "two", "three"];
  const model = new QuestionRankingModel("test");

  model["moveArrayItemBack"](items, 1);
  assert.deepEqual(items, ["two", "one", "three"], "moveArrayItemBack is ok");

  model["moveArrayItemForward"](items, 0);
  assert.deepEqual(
    items,
    ["one", "two", "three"],
    "moveArrayItemForward is ok"
  );

  let value = [];
  let visibleChoices: any = [
    { text: "one" },
    { text: "two" },
    { text: "three" },
  ];
  let rankingChoices = [];

  rankingChoices = model["mergeValueAndVisibleChoices"](value, visibleChoices);
  assert.deepEqual(
    rankingChoices,
    visibleChoices,
    "mergeValueAndVisibleChoices returns visibleChoices if empty value"
  );

  value = ["two", "one", "three"];
  rankingChoices = model["mergeValueAndVisibleChoices"](value, visibleChoices);
  assert.deepEqual(
    rankingChoices,
    [{ text: "two" }, { text: "one" }, { text: "three" }],
    "mergeValueAndVisibleChoices returns correct value"
  );
});

QUnit.test("Ranking: Survey data", function(assert) {
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
    q1.rankingChoices.map(item => item.text),
    ["b", "a", "c"]
  );
});

QUnit.test("Ranking: check removing other from visibleChoices", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
        hasOther: true,
      },
    ],
  });
  var rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q1");

  var visibleChoicesWithoutOther: any = rankingQuestion[
    "removeOtherChoiceFromChoices"
  ](rankingQuestion.visibleChoices).map(choice => choice.value);

  assert.deepEqual(visibleChoicesWithoutOther.indexOf("other"), -1);
  assert.deepEqual(rankingQuestion.rankingChoices.length, 3);
});

QUnit.test("Ranking: Carry Forward", function(assert) {
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
  assert.deepEqual(q2.isIndeterminate, true);

  q1.value = [2, 3];
  q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
  assert.deepEqual(q2.isIndeterminate, false);
  assert.deepEqual(survey.data, {
    q1: [2, 3],
    q2: [2, 3],
  });

  // ranking question with only one choice doesn't make sense
  q1.value = ["2"];
  assert.deepEqual(q2.isIndeterminate, true);
  assert.deepEqual(survey.data, {
    q1: [2],
  });

  q1.value = [];
  assert.deepEqual(q2.isIndeterminate, true);
  assert.deepEqual(
    q2.rankingChoices.map(item => item.text),
    []
  );

  q1.value = [2, 3];
  q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
  assert.deepEqual(q2.isIndeterminate, false);
  assert.deepEqual(survey.data, {
    q1: [2, 3],
    q2: [2, 3],
  });
});
