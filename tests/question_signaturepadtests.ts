import { QuestionSignaturePadModel } from "../src/question_signaturepad";
import { SurveyModel } from "../src/survey";

QUnit.test("QuestionSignaturePadModel dataFormat default value", function (
  assert
) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "", "default value");
});

QUnit.test("QuestionSignaturePadModel dataFormat values", function (assert) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "", "defaultValue");

  var el = document.createElement("div");
  el.appendChild(document.createElement("canvas"));
  el.appendChild(document.createElement("button"));
  question.initSignaturePad(el);

  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/png;", "png");

  question.dataFormat = "image/jpeg";
  assert.equal(question.dataFormat, "image/jpeg", "jpeg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/jpeg", "jpeg");

  question.dataFormat = "image/svg+xml";
  assert.equal(question.dataFormat, "image/svg+xml", "svg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/svg+", "svg");
});

QUnit.test("check allowClear", (assert) => {
  var json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  assert.equal(signaturepad.allowClear, true, "allowClear");
  assert.equal(signaturepad.readOnly, false, "readOnly");
  assert.equal(signaturepad.canShowClearButton, true, "canShowClearButton");

  signaturepad.allowClear = false;
  assert.equal(signaturepad.allowClear, false, "allowClear");
  assert.equal(signaturepad.readOnly, false, "readOnly");
  assert.equal(signaturepad.canShowClearButton, false, "canShowClearButton");
});

QUnit.test("Check signaturepad signauteWidth/Height properties", (assert) => {
  var json: any = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  const signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 300);
  assert.equal(signaturepad.signatureHeight, 200);
  assert.equal(canvas.width, 300);
  assert.equal(canvas.height, 200);
  signaturepad.signatureWidth = 400;
  signaturepad.signatureHeight = 300;
  assert.equal(canvas.width, 400);
  assert.equal(canvas.height, 300);
});
//todo: need to remove this test after code modification
QUnit.test("Check width/height influence on signageWidth/Height properties", (assert) => {
  let json: any = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        width: 400,
        height: 300
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 400);
  assert.equal(signaturepad.signatureHeight, 300);
  assert.equal(canvas.width, 400);
  assert.equal(canvas.height, 300);

  json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        width: "400",
      },
    ],
  };
  survey = new SurveyModel(json);
  signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 300);
  assert.equal(canvas.width, 300);

  json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        signatureWidth: 400,
        signatureHeight: 300,
        width: 600,
        height: 600
      },
    ],
  };
  survey = new SurveyModel(json);
  signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 400);
  assert.equal(canvas.width, 400);
  assert.equal(signaturepad.signatureHeight, 300);
  assert.equal(canvas.height, 300);
});