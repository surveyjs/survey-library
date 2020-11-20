import { SurveyModel } from "../src/survey";

import { QuestionSelectBase } from "../src/question_baseselect";
import { settings } from "../src/settings";

export default QUnit.module("baseselect");

function getValuesInColumns(question: QuestionSelectBase) {
  return question.columns.map((column) => column.map((choice) => choice.value));
}

QUnit.test("Check QuestionSelectBase columns property", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        choices: ["Item1", "Item2", "Item3", "Item4"],
        colCount: 2,
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionSelectBase>survey.getAllQuestions()[0];
  var columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [
      ["Item1", "Item3"],
      ["Item2", "Item4"],
    ],
    "check showItemsBy row"
  );
  settings.showItemsInOrder = "column";
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [
      ["Item1", "Item2"],
      ["Item3", "Item4"],
    ],
    "check showItemsBy column"
  );
});
