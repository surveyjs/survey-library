import { Serializer } from "../src/jsonobject";
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
  assert.equal(signaturepad.canShowClearButton, false, "canShowClearButton");

  signaturepad.valueWasChangedFromLastUpload = true;
  assert.equal(signaturepad.canShowClearButton, true, "canShowClearButton");
  signaturepad.valueWasChangedFromLastUpload = false;
  assert.equal(signaturepad.canShowClearButton, false, "canShowClearButton");

  signaturepad.value = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
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
  const ratio = 1;
  signaturepad.initSignaturePad(containerEl);
  assert.equal(signaturepad.signatureWidth, 300);
  assert.equal(signaturepad.signatureHeight, 200);
  assert.equal(canvas.width, 300 * ratio);
  assert.equal(canvas.height, 200 * ratio);
  signaturepad.signatureWidth = 400;
  signaturepad.signatureHeight = 300;
  assert.equal(canvas.width, 400 * ratio);
  assert.equal(canvas.height, 300 * ratio);

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

QUnit.test("check penColor & background color from json", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        penColor: "#e92525",
        backgroundColor: "#dde6db"
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.penColor, "#e92525", "penColor init");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor init");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#e92525", "signaturePad.penColor init");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#dde6db", "signaturePad.backgroundColor init");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, "#e92525", "penColor init");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor init");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#e92525", "signaturePad.penColor init");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#dde6db", "signaturePad.backgroundColor init");

  survey.applyTheme({ "cssVariables": {} });
  assert.equal(signaturepadQuestion.penColor, "#e92525", "penColor init");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor init");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#e92525", "signaturePad.penColor init");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#dde6db", "signaturePad.backgroundColor init");
});

QUnit.test("check penColor & background color from theme", (assert) => {
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

  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#ffffff", "signaturePad.backgroundColor default");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "rgba(103, 58, 176, 1)", "signaturePad.penColor from theme");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor from theme");

  survey.applyTheme({ "cssVariables": {} });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor default");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "#ffffff", "signaturePad.backgroundColor default");
});

QUnit.test("check penColor & background color if background image", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        backgroundImage: "someUrl",
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

  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor #1ab394");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor transparent");

  survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "rgba(103, 58, 176, 1)", "signaturePad.penColor from theme");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor from theme");

  survey.applyTheme({ "cssVariables": {} });
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, undefined, "backgroundColor undefined");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor #1ab394");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor transparent");

  signaturepadQuestion.backgroundColor = "#dde6db";
  assert.equal(signaturepadQuestion.penColor, undefined, "penColor undefined");
  assert.equal(signaturepadQuestion.backgroundColor, "#dde6db", "backgroundColor #dde6db");
  assert.equal(signaturepadQuestion.signaturePad.penColor, "#1ab394", "signaturePad.penColor #1ab394");
  assert.equal(signaturepadQuestion.signaturePad.backgroundColor, "transparent", "signaturePad.backgroundColor transparent");
});

QUnit.test("check showPlaceholder & placeholder properties", (assert) => {
  let json: any = {
    questions: [
      {
        type: "signaturepad",
        backgroundImage: "someUrl",
        name: "q1",
      },
    ],
  };
  let survey = new SurveyModel(json);
  let question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
  assert.ok(question.needShowPlaceholder(), "#0");
  assert.equal(question.locPlaceholder.renderedHtml, "Sign here");
  assert.equal(question.locRenderedPlaceholder.renderedHtml, "Sign here");

  question.valueWasChangedFromLastUpload = true;
  assert.equal(question.needShowPlaceholder(), false, "#1");
  question.valueWasChangedFromLastUpload = false;
  assert.equal(question.needShowPlaceholder(), true), "#2";

  question.value = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
  assert.equal(question.needShowPlaceholder(), false, "#3");

  question.showPlaceholder = false;
  assert.notOk(question.needShowPlaceholder(), "#4");
  question.placeholder = "test sign";
  assert.equal(question.locPlaceholder.renderedHtml, "test sign");

  assert.equal(question.locRenderedPlaceholder.renderedHtml, "test sign");
  question.readOnly = true;
  assert.equal(question.locRenderedPlaceholder.renderedHtml, "No signature");
  question.placeholderReadOnly = "empty sign";
  assert.equal(question.locRenderedPlaceholder.renderedHtml, "empty sign");

  json = {
    questions: [
      {
        type: "signaturepad",
        backgroundImage: "someUrl",
        name: "q1",
        showPlaceholder: false,
        placeHolder: "test sign"
      },
    ],
  };
  survey = new SurveyModel(json);
  question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
  assert.notOk(question.needShowPlaceholder());
  question.placeholder = "test sign";
  assert.equal(question.locPlaceholder.renderedHtml, "test sign");
});

QUnit.test("check placeholder property visibility", (assert) => {
  const prop1 = Serializer.getProperty("signaturepad", "placeholder");
  const prop2 = Serializer.getProperty("signaturepad", "placeholderReadOnly");
  assert.deepEqual(Serializer.getProperty("signaturepad", "showPlaceholder").getDependedProperties(), [prop1.name, prop2.name]);
  const q1 = new QuestionSignaturePadModel("q1");
  q1.showPlaceholder = true;
  assert.equal(prop1.isVisible(undefined, q1), true);
  q1.showPlaceholder = false;
  assert.equal(prop1.isVisible(undefined, q1), false);
});

QUnit.test("check rendered size properties", (assert) => {
  const json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1",
        "penColor": "#ff0000"
      },
    ],
  };
  const containerEl = document.createElement("div");
  const canvas = document.createElement("canvas");
  containerEl.appendChild(canvas);
  let survey = new SurveyModel(json);
  let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepadQuestion.initSignaturePad(containerEl);

  assert.equal(signaturepadQuestion.renderedCanvasWidth, "300px");

  signaturepadQuestion.signatureWidth = 500;

  assert.equal(signaturepadQuestion.renderedCanvasWidth, "500px");

  signaturepadQuestion.signatureAutoScaleEnabled = true;
  assert.equal(signaturepadQuestion.renderedCanvasWidth, "100%");
});

QUnit.test("Question Signature upload files", function (assert) {
  var json = {
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        dataFormat: "svg",
        storeDataAsText: false,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionSignaturePadModel = <any>survey.getQuestionByName("signature");
  var done = assert.async();

  var eventFired;
  var fileLoaded;
  var fileName;
  var fileType;
  var fileContent;
  survey.onUploadFiles.add((survey, options) => {
    let file = options.files[0];
    let fileReader = new FileReader();
    eventFired = true;
    fileReader.onload = (e) => {
      fileLoaded = true;
      fileName = file.name;
      fileType = file.type;
      fileContent = fileReader.result;
      setTimeout(
        () =>
          options.callback(
            "success",
            options.files.map((file) => {
              return { file: file, content: file.name + "_url" };
            })
          ),
        2
      );
    };
    fileReader.readAsDataURL(file);
  });

  const el = document.createElement("div");
  el.append(document.createElement("canvas"));
  q1.afterRenderQuestionElement(el);
  q1["signaturePad"].fromData([{ "penColor": "rgba(25, 179, 148, 1)", "dotSize": 0, "minWidth": 0.5, "maxWidth": 2.5, "velocityFilterWeight": 0.7, "compositeOperation": "source-over", "points": [{ "time": 1701152337021, "x": 9, "y": 11, "pressure": 0.5 }] }, { "penColor": "rgba(25, 179, 148, 1)", "dotSize": 0, "minWidth": 0.5, "maxWidth": 2.5, "velocityFilterWeight": 0.7, "compositeOperation": "source-over", "points": [{ "time": 1701152337856, "x": 15, "y": 18, "pressure": 0.5 }] }]);
  q1.valueWasChangedFromLastUpload = true;
  q1.onBlur({ target: null } as any);

  const width = 300 / window.devicePixelRatio;
  const height = 200 / window.devicePixelRatio;

  survey.onValueChanged.add((survey, options) => {
    assert.equal(q1.value, "signature.svg_url");
    assert.ok(eventFired);
    assert.ok(fileLoaded);

    assert.equal(fileType, "image/svg+xml");
    assert.equal(fileName, "signature.svg");
    assert.equal(fileContent, "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + width + " " + height + '" width="' + width + '" height="' + height + '"><circle r="1.5" cx="9" cy="11" fill="rgba(25, 179, 148, 1)"></circle><circle r="1.5" cx="15" cy="18" fill="rgba(25, 179, 148, 1)"></circle></svg>'));
    done();
  });
});

QUnit.test("Question Signature upload files - and complete", function (assert) {
  var json = {
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        storeDataAsText: false,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionSignaturePadModel = <any>survey.getQuestionByName("signature");
  var done = assert.async();
  var filesLoaded = false;
  survey.onUploadFiles.add((survey, options) => {
    setTimeout(
      () => {
        filesLoaded = true;
        options.callback(
          "success",
          options.files.map((file) => {
            return { file: file, content: file.name + "_url" };
          })
        );
      },
      2
    );
  });

  const el = document.createElement("div");
  el.append(document.createElement("canvas"));
  q1.afterRenderQuestionElement(el);
  q1.valueWasChangedFromLastUpload = true;
  survey.onComplete.add((survey, options) => {
    assert.ok(filesLoaded);
    done();
  });

  q1.onBlur({ target: null } as any);
  survey.navigationBar.getActionById("sv-nav-complete").action();

});

QUnit.test("Question Signature pad invisible - on complete", function (assert) {
  var json = {
    questions: [
      {
        type: "text",
        name: "text"
      },
      {
        type: "signaturepad",
        name: "signature",
        visibleIf: "{text} = 'cba'"
      },
    ],
  };

  var survey = new SurveyModel(json);
  survey.getQuestionByName("text").value = "abc";
  survey.doComplete();
  assert.deepEqual(survey.data, { text: "abc" });
});

QUnit.test("Check signature download file event", (assert) => {
  var el = document.createElement("div");
  var canv = document.createElement("canvas");
  el.appendChild(canv);
  const survey = new SurveyModel({
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        "signatureWidth": 100,
        "signatureHeight": 100,
        "dataFormat": "svg",
        storeDataAsText: false
      }
    ],
  });
  var q: QuestionSignaturePadModel = <QuestionSignaturePadModel>survey.getQuestionByName("signature");
  q.initSignaturePad(el);
  let log = "";
  survey.onDownloadFile.add((survey, options) => {
    log += "->" + options.fileValue;
    options.callback(
      "success",
      ""
    );
  });

  assert.equal(q.currentState, "empty", "Initial state is empty");
  survey.data = {
    "signature": "file1.png"
  };
  assert.equal(log, "->file1.png", "file should be loaded only once");
  assert.equal(q.currentState, "loaded", "The loaded state after data assigned");

  canv.remove();
  el.remove();
});

QUnit.test("Check isReady flag with onDownloadFile callback", (assert) => {
  var el = document.createElement("div");
  var canv = document.createElement("canvas");
  el.appendChild(canv);
  const survey = new SurveyModel({
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        storeDataAsText: false,
      }
    ],
  });
  const question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
  assert.equal(question.isReady, true, "question is ready before init");
  question.initSignaturePad(el);
  assert.equal(question.isReady, true, "question is ready after init");
  let log = "";
  const callbacks = new Array<any>();
  const contents = new Array<string>();
  survey.onDownloadFile.add((survey, options) => {
    assert.equal(options.question.isReady, false);
    contents.push("data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'));
    callbacks.push(options.callback);
    log += "->" + options.fileValue;
  });
  const readyLogs = new Array<boolean>();
  question.onReadyChanged.add(() => {
    readyLogs.push(question.isReady);
  });
  assert.equal(question.isReady, true, "question is ready before data assignment");
  survey.data = {
    "signature": "file1.svg"
  };
  assert.equal(question.isReady, false, "question is not ready");
  assert.equal(log, "->file1.svg");
  assert.equal(callbacks.length, 1, "One callback");
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]("success", contents[i]);
  }
  assert.equal(question.isReady, true, "question is ready");
  assert.equal(readyLogs.length, 2, "readyLogs.length");
  assert.equal(readyLogs[0], false, "readyLogs[0]");
  assert.equal(readyLogs[1], true, "readyLogs[1]");

  canv.remove();
  el.remove();
});

QUnit.test("Check storeDataAsText: false and base64 data", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        storeDataAsText: false,
      }
    ],
  });
  const question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
  assert.equal(question.isReady, true, "question is ready before data");
  let log = "";
  question.onReadyChanged.add((_, opt) => {
    log += `->${opt.isReady}`;
  });
  const base64Url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII";
  survey.data = {
    signature: base64Url
  };
  assert.equal(question.loadedData, base64Url);
  assert.equal(log, "->false->true", "isReady changed only one time");
});

QUnit.test("Check storeDataAsText: false and no download file callback and incorrect link passed", (assert) => {
  const done = assert.async();
  const survey = new SurveyModel({
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        storeDataAsText: false,
      }
    ],
  });
  const question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
  assert.equal(question.isReady, true, "question is ready before data");
  let log = "";
  question.onReadyChanged.add((_, opt) => {
    log += `->${opt.isReady}`;
  });
  const url = "http://localhost:7777/image.jpg";
  survey.data = {
    signature: url
  };
  setTimeout(() => {
    assert.equal(question.loadedData, undefined);
    assert.equal(question.value, url);
    assert.equal(log, "->false->true", "isReady changed only one time");
    done();
  }, 2500);
});

QUnit.test("Check signature image cached in loadedData and loaded only once until value changed", (assert) => {
  var el = document.createElement("div");
  var canv = document.createElement("canvas");
  el.appendChild(canv);
  const survey = new SurveyModel({
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        storeDataAsText: false,
      }
    ],
  });
  const loadedData = {
    "file1.svg": "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="1"></svg>'),
    "file2.svg": "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="2"></svg>')
  };
  const question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];

  let log = "";
  const callbacks = new Array<any>();
  const contents = new Array<string>();
  survey.onDownloadFile.add((survey, options) => {
    assert.equal(options.question.isReady, false);
    contents.push(loadedData[options.question.value]);
    callbacks.push(options.callback);
    log += "->" + options.fileValue;
  });

  assert.equal(log, "");
  assert.equal(callbacks.length, 0, "No callbacks");
  assert.equal(question.value, undefined);
  assert.equal(question.loadedData, undefined);
  assert.equal(question.isReady, true, "question is ready before data assignment");

  survey.data = {
    "signature": "file1.svg"
  };
  assert.equal(log, "->file1.svg");
  assert.equal(callbacks.length, 1, "One callback");
  assert.equal(question.value, "file1.svg");
  assert.equal(question.loadedData, undefined);
  assert.equal(question.isReady, false, "question is not ready after data assignment");
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]("success", contents[i]);
  }
  callbacks.length = 0;
  contents.length = 0;

  let dataFromUrlLog = "";
  // question.initSignaturePad(el);
  question.signaturePad = {
    fromDataURL: (data: string) => (dataFromUrlLog += "->" + data)
  };
  question["canvas"] = canv;
  question["loadPreview"](question.value);

  assert.equal(log, "->file1.svg");
  assert.equal(callbacks.length, 0, "No callbacks");
  assert.equal(question.value, "file1.svg");
  assert.equal(question.loadedData, loadedData["file1.svg"], "loadedData after widget initialized");
  assert.equal(dataFromUrlLog, "->" + loadedData["file1.svg"], "signaturepad.fromDataURL after widget initialized");
  assert.equal(question.isReady, true, "question ready after widget initialized");

  question.signatureWidth = 1000;

  assert.equal(log, "->file1.svg");
  assert.equal(callbacks.length, 0, "No callbacks");
  assert.equal(question.value, "file1.svg");
  assert.equal(question.loadedData, loadedData["file1.svg"], "loadedData after resize");
  assert.equal(dataFromUrlLog, "->" + loadedData["file1.svg"], "signaturepad.fromDataURL after resize");
  assert.equal(question.isReady, true, "question ready after resize");

  question.value = "file2.svg";
  // survey.data = {
  //   "signature": "file2.svg"
  // };

  assert.equal(log, "->file1.svg->file2.svg");
  assert.equal(callbacks.length, 1, "One callback");
  assert.equal(question.value, "file2.svg");
  assert.equal(question.loadedData, undefined, "No data available for a while after value changed");
  assert.equal(dataFromUrlLog, "->" + loadedData["file1.svg"], "signaturepad.fromDataURL after resize");
  assert.equal(question.isReady, false, "question is not ready after data assignment");
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]("success", contents[i]);
  }
  callbacks.length = 0;

  assert.equal(log, "->file1.svg->file2.svg");
  assert.equal(callbacks.length, 0, "No callbacks");
  assert.equal(question.value, "file2.svg");
  assert.equal(question.loadedData, loadedData["file2.svg"], "Another data loaded");
  assert.equal(dataFromUrlLog, "->" + loadedData["file1.svg"] + "->" + loadedData["file2.svg"], "signaturepad.fromDataURL after value changed");
  assert.equal(question.isReady, true, "question ready after loading data after value changedt");

  canv.remove();
  el.remove();
});

QUnit.test("do not init in design mode", (assert) => {
  var el = document.createElement("div");
  var json = {
    questions: [
      {
        type: "signaturepad",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.setDesignMode(true);
  const signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
  signaturepad.afterRenderQuestionElement(el);

  assert.notOk(signaturepad["signaturePad"]);

  el.remove();
});