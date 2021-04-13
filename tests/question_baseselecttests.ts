import { SurveyModel } from "../src/survey";

import { QuestionSelectBase } from "../src/question_baseselect";
import { settings } from "../src/settings";

export default QUnit.module("baseselect");

function getValuesInColumns(question: QuestionSelectBase) {
  return question.columns.map(column => column.map(choice => choice.value));
}

QUnit.test("Check QuestionSelectBase columns property", function(assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        choices: ["Item1", "Item2", "Item3", "Item4", "Item5"],
        colCount: 3,
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionSelectBase>survey.getAllQuestions()[0];
  var columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item4"], ["Item2", "Item5"], ["Item3"]],
    "check showItemsBy row"
  );
  settings.showItemsInOrder = "column";
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check showItemsBy column"
  );
});
QUnit.test("Set ", function(assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "q1",
        choicesByUrl: {
          path: "path1",
          valueName: "val1",
        },
      },
      {
        type: "checkbox",
        name: "q2",
        choicesByUrl: {
          path: "path2",
          titleName: "title1",
        },
      },
    ],
  };
  var survey = new SurveyModel(json);
  var q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  var q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  q2.choicesByUrl = q1.choicesByUrl;
  assert.equal(q2.choicesByUrl.path, "path1", "path set correctly");
  assert.equal(q2.choicesByUrl.valueName, "val1", "valueName set correctly");
  assert.equal(q2.choicesByUrl.titleName, "", "titleName is cleard");
});
