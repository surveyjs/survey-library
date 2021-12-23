import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRankingModel } from "../src/question_ranking";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question ranking");

QUnit.test("Ranking: Base ", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
      },
    ],
  });
  var rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q1");

  assert.deepEqual(
    rankingQuestion.rankingChoices.map((c)=>c.value),
    ["a", "b", "c"],
    "rankingChoices returns visibleChoices if empty value"
  );

  rankingQuestion.value = ["c", "b", "a"];
  assert.deepEqual(
    rankingQuestion.rankingChoices.map((c)=>c.value),
    ["c", "b", "a"],
    "rankingChoices returns visibleChoices if empty value"
  );
});

QUnit.test("Ranking: predefined Survey data", function(assert) {
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
  assert.deepEqual(q1.isEmpty(), false);
  assert.deepEqual(
    q1.rankingChoices.map(item => item.value),
    ["b", "a", "c"]
  );

  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: [
          {
            value: "1",
            text: "a",
          },
          {
            value: "2",
            text: "b",
          },
          {
            value: "3",
            text: "c",
          },
        ],
      },
    ],
  });
  survey.data = { q1: ["3", "2", "1"] };
  var q1 = <QuestionRankingModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, ["3", "2", "1"]);
  assert.deepEqual(q1.isEmpty(), false);
  assert.deepEqual(
    q1.rankingChoices.map(item => item.text),
    ["c", "b", "a"]
  );
  assert.deepEqual(
    q1.rankingChoices.map(item => item.value),
    ["3", "2", "1"]
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
  assert.deepEqual(q2.isEmpty(), true);

  q1.value = [2, 3];
  q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
  assert.deepEqual(q2.isEmpty(), false);
  assert.deepEqual(survey.data, {
    q1: [2, 3],
    q2: [2, 3],
  });

  // ranking question with only one choice doesn't make sense
  q1.value = ["2"];
  assert.deepEqual(q2.isEmpty(), true);
  assert.deepEqual(survey.data, {
    q1: [2],
  });

  q1.value = [];
  assert.deepEqual(q2.isEmpty(), true);
  assert.deepEqual(
    q2.rankingChoices.map(item => item.text),
    []
  );

  q1.value = [2, 3];
  q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
  assert.deepEqual(q2.isEmpty(), false);
  assert.deepEqual(survey.data, {
    q1: [2, 3],
    q2: [2, 3],
  });
});
QUnit.test("Ranking: CorrectAnswer, Bug#3720", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b"],
        correctAnswer: ["b", "a"]
      },
    ],
  });
  var q = <QuestionRankingModel>survey.getQuestionByName("q1");
  q.value = ["a", "b"];
  assert.equal(q.isAnswerCorrect(), false, "Answer is not correct");
  q.value = ["b", "a"];
  assert.equal(q.isAnswerCorrect(), true, "Answer is correct");
});

QUnit.test("Ranking: ReadOnlyMode ", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["a", "b", "c"],
      },
    ],
  });

  var q = <QuestionRankingModel>survey.getQuestionByName("q");
  assert.equal(q["allowStartDrag"], true);
  survey.mode = "display";
  assert.equal(q["allowStartDrag"], false);
});