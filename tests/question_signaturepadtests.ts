import { QuestionSignaturePadModel } from "../src/question_signaturepad";
import { SurveyModel } from "../src/survey";

export default QUnit.module("question signaturepad");

QUnit.test("QuestionSignaturePadModel dataFormat default value", function (
  assert
) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "png", "default value");
});

QUnit.test("QuestionSignaturePadModel dataFormat values", function (assert) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "png", "defaultValue");

  var el = document.createElement("div");
  el.appendChild(document.createElement("canvas"));
  el.appendChild(document.createElement("button"));
  question.initSignaturePad(el);

  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/png;", "png");

  question.dataFormat = "image/jpeg";
  assert.equal(question.dataFormat, "jpeg", "jpeg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/jpeg", "jpeg");

  question.dataFormat = "image/svg+xml";
  assert.equal(question.dataFormat, "svg", "svg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/svg+", "svg");

  question.dataFormat = "jpeg";
  assert.equal(question.dataFormat, "jpeg", "jpeg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/jpeg", "jpeg#2");

  question.dataFormat = "svg";
  assert.equal(question.dataFormat, "svg", "svg format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/svg+", "svg#2");

  question.dataFormat = "png";
  assert.equal(question.dataFormat, "png", "png format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/png;", "png#2");

  question.dataFormat = "";
  assert.equal(question.dataFormat, "png", "png format");
  question["updateValue"]();
  assert.equal(question.value.substring(0, 15), "data:image/png;", "png#3");

  el.remove();
});
QUnit.test("QuestionSignaturePadModel dataFormat converters", function (assert) {
  var question = new QuestionSignaturePadModel("q");
  assert.equal(question.dataFormat, "png", "#1");
  question.fromJSON({ name: "q", dataFormat: "jpeg" });
  assert.equal(question.dataFormat, "jpeg", "#2");
  question.fromJSON({ name: "q", dataFormat: "svg" });
  assert.equal(question.dataFormat, "svg", "#3");
  question.fromJSON({ name: "q", dataFormat: "dffd" });
  assert.equal(question.dataFormat, "png", "#4");
  question.fromJSON({ name: "q", dataFormat: "image/jpeg" });
  assert.equal(question.dataFormat, "jpeg", "#5");
  question.fromJSON({ name: "q", dataFormat: "image/svg+xml" });
  assert.equal(question.dataFormat, "svg", "#6");
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

  canvas.remove();
  containerEl.remove();
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

  canvas.remove();
  containerEl.remove();
});

QUnit.test("check penColor & background color, useCustomColors - true", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        useCustomColors: true
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.backgroundColor, "#ffffff", "backgroundColor default");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#ffffff", "backgroundColor default");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.backgroundColor, "#ffffff", "backgroundColor default");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#ffffff", "backgroundColor default");

  survey.applyTheme({ "cssVariables": { } });
  assert.equal(signaturepadQuestion.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.backgroundColor, "#ffffff", "backgroundColor default");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#ffffff", "backgroundColor default");
});

QUnit.test("check penColor & background color, useCustomColors - false", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.backgroundColor, "transparent", "backgroundColor");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "backgroundColor default");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, "rgba(103, 58, 176, 1)", "penColor from theme");
  assert.equal(signaturepadQuestion.backgroundColor, "transparent", "backgroundColor");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "rgba(103, 58, 176, 1)", "penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "backgroundColor default");

  survey.applyTheme({ "cssVariables": { } });
  assert.equal(signaturepadQuestion.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.backgroundColor, "transparent", "backgroundColor");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "backgroundColor default");
});