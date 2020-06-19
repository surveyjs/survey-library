import { SurveyModel } from "../src/survey";

import { QuestionBooleanModel } from "../src/question_boolean";

export default QUnit.module("boolean");

QUnit.test("Test boolean labelTrue and labelFalse property", function (assert) {
  var json = {
    questions: [
      {
        type: "boolean",
        name: "bool",
        label: "Default label tests",
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

  assert.equal(
    question.locLabelTrue.textOrHtml,
    "Yes",
    "default labelTrue is ok"
  );
  assert.equal(
    question.locLabelFalse.textOrHtml,
    "No",
    "default labelFalse is ok"
  );
  assert.equal(
    question.locLabelTrue.renderedHtml,
    "Yes",
    "default locLabelTrue is ok"
  );
  assert.equal(
    question.locLabelFalse.renderedHtml,
    "No",
    "default locLabelFalse is ok"
  );
  question.labelTrue = "Check";
  question.labelFalse = "Uncheck";
  assert.equal(question.labelTrue, "Check", "labelTrue is ok");
  assert.equal(question.labelFalse, "Uncheck", "labelFalse is ok");
  assert.equal(
    question.locLabelTrue.renderedHtml,
    "Check",
    "locLabelTrue is ok"
  );
  assert.equal(
    question.locLabelFalse.renderedHtml,
    "Uncheck",
    "locLabelFalse is ok"
  );
});
