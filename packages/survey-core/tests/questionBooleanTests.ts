import { SurveyModel } from "../src/survey";

import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

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
  assert.strictEqual(question.getDefaultValue(), undefined, "getDefaultValue()");
  question.defaultValue = true;
  assert.equal(question.defaultValue, "true");
  assert.strictEqual(question.value, true);
  question.defaultValue = undefined;
  assert.strictEqual(question.defaultValue, undefined, "#1");
  assert.strictEqual(question.value, undefined, "#2");
  question.defaultValue = false;
  assert.equal(question.defaultValue, "false");
  assert.strictEqual(question.value, false);
  question.defaultValue = "indeterminate";
  assert.strictEqual(question.defaultValue, "indeterminate", "#3");
  assert.strictEqual(question.value, undefined, "#4");
  question.defaultValue = null;
  assert.strictEqual(question.defaultValue, null, "#5");
  assert.strictEqual(question.value, undefined, "#6");
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
  assert.strictEqual(question.value, undefined);
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
QUnit.test("Remove showTitle and label", function (assert) {
  const createBoolean = (json: any) => {
    const q = new QuestionBooleanModel("q1");
    q.fromJSON(json);
    return q;
  };
  let question = createBoolean({ "label": { default: "Label default", de: "Label de" } });
  assert.deepEqual(question.toJSON(), { name: "q1", title: { default: "Label default", de: "Label de" } }, "Copy title to label");
  question = createBoolean({ "title": "Title", "label": { default: "Label default", de: "Label de" } });
  assert.deepEqual(question.toJSON(), { name: "q1", title: "Title" }, "Do not copy label");
  question = createBoolean({ "title": "Title", "label": { default: "Label default", de: "Label de" }, titleLocation: "hidden" });
  assert.deepEqual(question.toJSON(), { name: "q1", title: { default: "Label default", de: "Label de" }, titleLocation: "hidden" }, "Title location is hidden");
});

QUnit.test("Check boolean labelRenderedAriaID", function (assert) {
  var json = {
    "elements": [
      {
        "type": "boolean",
        "name": "bool",
        "valueTrue": "true",
        "valueFalse": "false"
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
  assert.strictEqual(question.labelRenderedAriaID, null);

  question.titleLocation = "hidden";
  assert.strictEqual(question.labelRenderedAriaID.indexOf("_ariaTitle") !== -1, true);
});

QUnit.test("Boolean shouldn't call preventDefault on key down", function (assert) {
  var json = {
    "elements": [
      {
        "type": "boolean",
        "name": "bool",
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

  let pdCount = 0;
  let spCount = 0;
  const event = {
    key: "ArrowLeft",
    target: document.createElement("div"),
    preventDefault: () => { pdCount++; },
    stopPropagation: () => { spCount++; }
  };
  question.onKeyDownCore(event);
  assert.equal(pdCount, 0);
  assert.equal(spCount, 1);
});
QUnit.test("Boolean shouldn't set booleanValue in design time", function (assert) {
  var json = {
    "elements": [
      {
        "type": "boolean",
        "name": "bool",
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

  assert.equal(question.value, undefined);

  question.booleanValue = true;
  assert.equal(question.value, true);

  survey.setDesignMode(true);
  question.booleanValue = false;
  assert.equal(question.value, true);
});
QUnit.test("Boolean swapOrder", function (assert) {
  const survey = new SurveyModel({});
  const question = new QuestionBooleanModel("q1");
  survey.css = defaultCss;
  question.setSurveyImpl(survey);
  assert.equal(question.swapOrder, false);
  assert.equal(question.getItemCss(), "sd-boolean sd-boolean--allowhover sd-boolean--indeterminate");
  assert.equal(question.getLabelCss(false), "sd-boolean__label");
  assert.equal(question.getLabelCss(true), "sd-boolean__label");
  assert.equal(question.locLabelLeft, question.locLabelFalse);
  assert.equal(question.locLabelRight, question.locLabelTrue);

  question.swapOrder = true;
  assert.equal(question.swapOrder, true);
  assert.equal(question.getItemCss(), "sd-boolean sd-boolean--allowhover sd-boolean--exchanged sd-boolean--indeterminate");
  assert.equal(question.getLabelCss(false), "sd-boolean__label");
  assert.equal(question.getLabelCss(true), "sd-boolean__label");
  assert.equal(question.locLabelLeft, question.locLabelTrue);
  assert.equal(question.locLabelRight, question.locLabelFalse);
});
QUnit.test("Boolean in matrix dynamic", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "matrixdynamic", name: "q1", columns: [{ cellType: "text", name: "col1" }, { cellType: "boolean", name: "col2" }], rowCount: 1 }
    ]
  });
  const q = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  q.visibleRows[0].cells[0].value = "abc";
  assert.deepEqual(q.value, [{ col1: "abc" }], "there is not boolean value");
});
