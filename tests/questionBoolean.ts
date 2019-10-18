import { SurveyModel } from "../src/survey";

import { QuestionBooleanModel } from "../src/question_boolean";


QUnit.test("Test boolean labelTrue and labelFalse property", function(
  assert
) {
  var json = {
    questions: [
      {
        type: "boolean",
        name: "bool",
        label: "Default label tests"
      }
    ]
  };
  var survey = new SurveyModel(json);

  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

  assert.equal(question.labelFalse, "Yes", "default labelTrue is ok");
  assert.equal(question.labelTrue, "No", "default labelFalse is ok");
  assert.equal(
    question.locLabelFalse.renderedHtml,
    "Yes",
    "default locLabelTrue is ok"
  );
  assert.equal(
    question.locLabelTrue.renderedHtml,
    "No",
    "default locLabelFalse is ok"
  );
  question.labelFalse = "Uncheck"
  question.labelTrue = "Check"
  assert.equal(question.labelFalse, "Check", "labelTrue is ok");
  assert.equal(question.labelTrue, "Uncheck", "labelFalse is ok");
  assert.equal(
    question.locLabelFalse.renderedHtml,
    "Check",
    "locLabelTrue is ok"
  );
  assert.equal(
    question.locLabelTrue.renderedHtml,
    "Uncheck",
    "locLabelFalse is ok"
  );
});

