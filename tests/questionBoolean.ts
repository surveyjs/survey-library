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

//https://github.com/surveyjs/survey-library/issues/3653
QUnit.test("labelTrue/labelFalse with defaultValue", function (assert) {
  var json = {
    questions: [
      {
        type: "boolean",
        name: "boo-1",
        defaultValue: "yes",
        valueTrue: "yes",
      },
    ],
  };
  var survey = new SurveyModel(json);

  var booleanQ = <QuestionBooleanModel>survey.getAllQuestions()[0];

  assert.equal(
    booleanQ.value,
    "yes",
    "the value is equal to ValueTrue 'yes'"
  );
});

QUnit.test("Test boolean allowClick property", function (assert) {
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

  assert.equal(question.allowClick, true, "allowClick true is ok");
  question.booleanValue = true;
  assert.equal(question.allowClick, false, "allowClick false is ok");

  var surveyRO = new SurveyModel(json);
  var questionRO = <QuestionBooleanModel>surveyRO.getAllQuestions()[0];
  questionRO.readOnly = true;
  assert.equal(questionRO.allowClick, false, "allowClick false is ok");
});

QUnit.test("Check indeterminate defaultValue in design mode", function (assert) {
  var json = {
    questions: [
      {
        type: "boolean",
        name: "q1",
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.setDesignMode(true);
  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
  question.defaultValue = true;
  assert.equal(question.defaultValue, "true");
  assert.strictEqual(question.value, true);
  question.defaultValue = undefined;
  assert.equal(question.defaultValue, "indeterminate");
  assert.strictEqual(question.value, null);
});
QUnit.test("Check boolean with string values", function (assert) {
  var json = {
    questions: [
      {
        type: "boolean",
        name: "q1",
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
  question.value = "true";
  assert.strictEqual(question.value, true);
  question.value = "false";
  assert.strictEqual(question.value, false);
  question.value = "indeterminate";
  assert.strictEqual(question.value, null);
});
QUnit.test("Check boolean with valueTrue = 'true' and valueFalse = 'false'", function (assert) {
  var json = {
    "elements": [
      {
        "type": "boolean",
        "name": "bool",
        "valueTrue": "true",
        "valueFalse": "false",
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
  assert.strictEqual(question.valueTrue, "true", "Deserialisation");
  question.booleanValue = true;
  assert.strictEqual(question.value, "true", "Check value");
  assert.equal(question.booleanValue, true, "Check booleanValue");
  question.booleanValue = false;
  assert.strictEqual(question.value, "false", "Check value #2");
  assert.equal(question.booleanValue, false, "Check booleanValue #2");
  question.booleanValue = null;
  assert.strictEqual(question.isEmpty(), true, "Check value is empty");
});