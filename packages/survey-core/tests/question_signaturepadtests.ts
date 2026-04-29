import { Serializer } from "../src/jsonobject";
import { QuestionSignaturePadModel } from "../src/question_signaturepad";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("question signaturepad", () => {
  test("QuestionSignaturePadModel dataFormat default value", () => {
    var question = new QuestionSignaturePadModel("q");
    expect(question.dataFormat, "default value").toLooseEqual("png");
  });

  test("QuestionSignaturePadModel dataFormat values", () => {
    var question = new QuestionSignaturePadModel("q");
    expect(question.dataFormat, "defaultValue").toLooseEqual("png");

    var el = document.createElement("div");
    el.appendChild(document.createElement("canvas"));
    el.appendChild(document.createElement("button"));
    question.initSignaturePad(el);

    question["updateValue"]();
    expect(question.value.substring(0, 15), "png").toLooseEqual("data:image/png;");

    question.dataFormat = "image/jpeg";
    expect(question.dataFormat, "jpeg format").toLooseEqual("jpeg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "jpeg").toLooseEqual("data:image/jpeg");

    question.dataFormat = "image/svg+xml";
    expect(question.dataFormat, "svg format").toLooseEqual("svg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "svg").toLooseEqual("data:image/svg+");

    question.dataFormat = "jpeg";
    expect(question.dataFormat, "jpeg format").toLooseEqual("jpeg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "jpeg#2").toLooseEqual("data:image/jpeg");

    question.dataFormat = "svg";
    expect(question.dataFormat, "svg format").toLooseEqual("svg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "svg#2").toLooseEqual("data:image/svg+");

    question.dataFormat = "png";
    expect(question.dataFormat, "png format").toLooseEqual("png");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "png#2").toLooseEqual("data:image/png;");

    question.dataFormat = "";
    expect(question.dataFormat, "png format").toLooseEqual("png");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "png#3").toLooseEqual("data:image/png;");

    el.remove();
  });
  test("QuestionSignaturePadModel dataFormat converters", () => {
    var question = new QuestionSignaturePadModel("q");
    expect(question.dataFormat, "#1").toLooseEqual("png");
    question.fromJSON({ name: "q", dataFormat: "jpeg" });
    expect(question.dataFormat, "#2").toLooseEqual("jpeg");
    question.fromJSON({ name: "q", dataFormat: "svg" });
    expect(question.dataFormat, "#3").toLooseEqual("svg");
    question.fromJSON({ name: "q", dataFormat: "dffd" });
    expect(question.dataFormat, "#4").toLooseEqual("png");
    question.fromJSON({ name: "q", dataFormat: "image/jpeg" });
    expect(question.dataFormat, "#5").toLooseEqual("jpeg");
    question.fromJSON({ name: "q", dataFormat: "image/svg+xml" });
    expect(question.dataFormat, "#6").toLooseEqual("svg");
  });
  test("check allowClear", () => {
    var json = {
      elements: [
        {
          type: "signaturepad",
          name: "q1"
        },
      ],
    };
    const survey = new SurveyModel(json);
    const signaturepad = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
    expect(signaturepad.allowClear, "allowClear").toLooseEqual(true);
    expect(signaturepad.readOnly, "readOnly").toLooseEqual(false);
    expect(signaturepad.canShowClearButton, "canShowClearButton").toLooseEqual(false);

    signaturepad.valueWasChangedFromLastUpload = true;
    expect(signaturepad.canShowClearButton, "canShowClearButton").toLooseEqual(true);
    signaturepad.valueWasChangedFromLastUpload = false;
    expect(signaturepad.canShowClearButton, "canShowClearButton").toLooseEqual(false);

    signaturepad.value = "data:image/svg+xml,%3C xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
    expect(signaturepad.canShowClearButton, "canShowClearButton").toLooseEqual(true);

    signaturepad.allowClear = false;
    expect(signaturepad.allowClear, "allowClear").toLooseEqual(false);
    expect(signaturepad.readOnly, "readOnly").toLooseEqual(false);
    expect(signaturepad.canShowClearButton, "canShowClearButton").toLooseEqual(false);
  });

  test("Check signaturepad signauteWidth/Height properties", () => {
    var json: any = {
      elements: [
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
    expect(signaturepad.signatureWidth).toLooseEqual(300);
    expect(signaturepad.signatureHeight).toLooseEqual(200);
    expect(canvas.width).toLooseEqual(300 * ratio);
    expect(canvas.height).toLooseEqual(200 * ratio);
    signaturepad.signatureWidth = 400;
    signaturepad.signatureHeight = 300;
    expect(canvas.width).toLooseEqual(400 * ratio);
    expect(canvas.height).toLooseEqual(300 * ratio);

    canvas.remove();
    containerEl.remove();
  });
  //todo: need to remove this test after code modification
  test("Check width/height influence on signageWidth/Height properties", () => {
    let json: any = {
      elements: [
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
    expect(signaturepad.signatureWidth).toLooseEqual(400);
    expect(signaturepad.signatureHeight).toLooseEqual(300);
    expect(canvas.width).toLooseEqual(400);
    expect(canvas.height).toLooseEqual(300);

    json = {
      elements: [
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
    expect(signaturepad.signatureWidth).toLooseEqual(300);
    expect(canvas.width).toLooseEqual(300);

    json = {
      elements: [
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
    expect(signaturepad.signatureWidth).toLooseEqual(400);
    expect(canvas.width).toLooseEqual(400);
    expect(signaturepad.signatureHeight).toLooseEqual(300);
    expect(canvas.height).toLooseEqual(300);

    canvas.remove();
    containerEl.remove();
  });

  test("check penColor & background color from json", () => {
    const json = {
      elements: [
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

    expect(signaturepadQuestion.penColor, "penColor init").toLooseEqual("#e92525");
    expect(signaturepadQuestion.backgroundColor, "backgroundColor init").toLooseEqual("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor init").toLooseEqual("#e92525");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor init").toLooseEqual("#dde6db");

    survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
    expect(signaturepadQuestion.penColor, "penColor init").toLooseEqual("#e92525");
    expect(signaturepadQuestion.backgroundColor, "backgroundColor init").toLooseEqual("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor init").toLooseEqual("#e92525");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor init").toLooseEqual("#dde6db");

    survey.applyTheme({ "cssVariables": {} });
    expect(signaturepadQuestion.penColor, "penColor init").toLooseEqual("#e92525");
    expect(signaturepadQuestion.backgroundColor, "backgroundColor init").toLooseEqual("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor init").toLooseEqual("#e92525");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor init").toLooseEqual("#dde6db");
  });

  test("check penColor & background color from theme", () => {
    const json = {
      elements: [
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

    expect(signaturepadQuestion.penColor, "penColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor default").toLooseEqual("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor default").toLooseEqual("#ffffff");

    survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
    expect(signaturepadQuestion.penColor, "penColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor from theme").toLooseEqual("rgba(103, 58, 176, 1)");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor from theme").toLooseEqual("transparent");

    survey.applyTheme({ "cssVariables": {} });
    expect(signaturepadQuestion.penColor, "penColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor default").toLooseEqual("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor default").toLooseEqual("#ffffff");
  });

  test("check penColor & background color if background image", () => {
    const json = {
      elements: [
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

    expect(signaturepadQuestion.penColor, "penColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor #1ab394").toLooseEqual("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor transparent").toLooseEqual("transparent");

    survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
    expect(signaturepadQuestion.penColor, "penColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor from theme").toLooseEqual("rgba(103, 58, 176, 1)");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor from theme").toLooseEqual("transparent");

    survey.applyTheme({ "cssVariables": {} });
    expect(signaturepadQuestion.penColor, "penColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor #1ab394").toLooseEqual("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor transparent").toLooseEqual("transparent");

    signaturepadQuestion.backgroundColor = "#dde6db";
    expect(signaturepadQuestion.penColor, "penColor undefined").toLooseEqual(undefined);
    expect(signaturepadQuestion.backgroundColor, "backgroundColor #dde6db").toLooseEqual("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor #1ab394").toLooseEqual("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor transparent").toLooseEqual("transparent");
  });

  test("check showPlaceholder & placeholder properties", () => {
    let json: any = {
      elements: [
        {
          type: "signaturepad",
          backgroundImage: "someUrl",
          name: "q1",
        },
      ],
    };
    let survey = new SurveyModel(json);
    let question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
    expect(question.needShowPlaceholder(), "#0").toBeTruthy();
    expect(question.locPlaceholder.renderedHtml).toLooseEqual("Sign here");
    expect(question.locRenderedPlaceholder.renderedHtml).toLooseEqual("Sign here");

    question.valueWasChangedFromLastUpload = true;
    expect(question.needShowPlaceholder(), "#1").toLooseEqual(false);
    question.valueWasChangedFromLastUpload = false;
    expect(question.needShowPlaceholder()).toLooseEqual(true), "#2";

    question.value = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
    expect(question.needShowPlaceholder(), "#3").toLooseEqual(false);

    question.showPlaceholder = false;
    expect(question.needShowPlaceholder(), "#4").toBeFalsy();
    question.placeholder = "test sign";
    expect(question.locPlaceholder.renderedHtml).toLooseEqual("test sign");

    expect(question.locRenderedPlaceholder.renderedHtml).toLooseEqual("test sign");
    question.readOnly = true;
    expect(question.locRenderedPlaceholder.renderedHtml).toLooseEqual("No signature");
    question.placeholderReadOnly = "empty sign";
    expect(question.locRenderedPlaceholder.renderedHtml).toLooseEqual("empty sign");

    json = {
      elements: [
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
    expect(question.needShowPlaceholder()).toBeFalsy();
    question.placeholder = "test sign";
    expect(question.locPlaceholder.renderedHtml).toLooseEqual("test sign");
  });

  test("check placeholder property visibility", () => {
    const prop1 = Serializer.getProperty("signaturepad", "placeholder");
    const prop2 = Serializer.getProperty("signaturepad", "placeholderReadOnly");
    expect(Serializer.getProperty("signaturepad", "showPlaceholder").getDependedProperties()).toEqualValues([prop1.name, prop2.name]);
    const q1 = new QuestionSignaturePadModel("q1");
    q1.showPlaceholder = true;
    expect(prop1.isVisible(undefined, q1)).toLooseEqual(true);
    q1.showPlaceholder = false;
    expect(prop1.isVisible(undefined, q1)).toLooseEqual(false);
  });

  test("check rendered size properties", () => {
    const json = {
      elements: [
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

    expect(signaturepadQuestion.renderedCanvasWidth).toLooseEqual("300px");

    signaturepadQuestion.signatureWidth = 500;

    expect(signaturepadQuestion.renderedCanvasWidth).toLooseEqual("500px");

    signaturepadQuestion.signatureAutoScaleEnabled = true;
    expect(signaturepadQuestion.renderedCanvasWidth).toLooseEqual("100%");
  });

  test("Question Signature upload files", () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      var json = {
        elements: [
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
      const done = __done;

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
        expect(q1.value).toLooseEqual("signature.svg_url");
        expect(eventFired).toBeTruthy();
        expect(fileLoaded).toBeTruthy();

        expect(fileType).toLooseEqual("image/svg+xml");
        expect(fileName).toLooseEqual("signature.svg");
        expect(fileContent).toLooseEqual("data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + width + " " + height + '" width="' + width + '" height="' + height + '"><circle r="1.5" cx="9" cy="11" fill="rgba(25, 179, 148, 1)"></circle><circle r="1.5" cx="15" cy="18" fill="rgba(25, 179, 148, 1)"></circle></svg>'));
        done();
      });
    });
  });

  test("Question Signature upload files Error", () => {
    var json = {
      elements: [
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
    var errorIndex = 1;
    survey.onUploadFiles.add((survey, options) => {
      options.callback([], ["Error " + (errorIndex ++)]);
    });

    const el = document.createElement("div");
    el.append(document.createElement("canvas"));
    q1.afterRenderQuestionElement(el);
    q1.valueWasChangedFromLastUpload = true;
    q1.onBlur({ target: null } as any);

    expect(q1.errors.map(e => e.text)).toEqualValues(["Error 1"]);
    q1.valueWasChangedFromLastUpload = true;
    q1.onBlur({ target: null } as any);
    expect(q1.errors.map(e => e.text)).toEqualValues(["Error 2"]);
  });

  test("Question Signature upload files - and complete", () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      var json = {
        elements: [
          {
            type: "signaturepad",
            name: "signature",
            storeDataAsText: false,
          },
        ],
      };

      var survey = new SurveyModel(json);
      var q1: QuestionSignaturePadModel = <any>survey.getQuestionByName("signature");
      const done = __done;
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
        expect(filesLoaded).toBeTruthy();
        done();
      });

      q1.onBlur({ target: null } as any);
      survey.navigationBar.getActionById("sv-nav-complete").action();

    });
  });

  test("Question Signature pad invisible - on complete", () => {
    var json = {
      elements: [
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
    expect(survey.data).toEqualValues({ text: "abc" });
  });

  test("Check signature download file event", () => {
    var el = document.createElement("div");
    var canv = document.createElement("canvas");
    el.appendChild(canv);
    const survey = new SurveyModel({
      elements: [
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

    expect(q.currentState, "Initial state is empty").toLooseEqual("empty");
    survey.data = {
      "signature": "file1.png"
    };
    expect(log, "file should be loaded only once").toLooseEqual("->file1.png");
    expect(q.currentState, "The loaded state after data assigned").toLooseEqual("loaded");

    canv.remove();
    el.remove();
  });

  test("Check isReady flag with onDownloadFile callback", () => {
    var el = document.createElement("div");
    var canv = document.createElement("canvas");
    el.appendChild(canv);
    const survey = new SurveyModel({
      elements: [
        {
          type: "signaturepad",
          name: "signature",
          storeDataAsText: false,
        }
      ],
    });
    const question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
    expect(question.isReady, "question is ready before init").toLooseEqual(true);
    question.initSignaturePad(el);
    expect(question.isReady, "question is ready after init").toLooseEqual(true);
    let log = "";
    const callbacks = new Array<any>();
    const contents = new Array<string>();
    survey.onDownloadFile.add((survey, options) => {
      expect(options.question.isReady).toLooseEqual(false);
      contents.push("data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'));
      callbacks.push(options.callback);
      log += "->" + options.fileValue;
    });
    const readyLogs = new Array<boolean>();
    question.onReadyChanged.add(() => {
      readyLogs.push(question.isReady);
    });
    expect(question.isReady, "question is ready before data assignment").toLooseEqual(true);
    survey.data = {
      "signature": "file1.svg"
    };
    expect(question.isReady, "question is not ready").toLooseEqual(false);
    expect(log).toLooseEqual("->file1.svg");
    expect(callbacks.length, "One callback").toLooseEqual(1);
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]("success", contents[i]);
    }
    expect(question.isReady, "question is ready").toLooseEqual(true);
    expect(readyLogs.length, "readyLogs.length").toLooseEqual(2);
    expect(readyLogs[0], "readyLogs[0]").toLooseEqual(false);
    expect(readyLogs[1], "readyLogs[1]").toLooseEqual(true);

    canv.remove();
    el.remove();
  });

  test("Check storeDataAsText: false and base64 data", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "signaturepad",
          name: "signature",
          storeDataAsText: false,
        }
      ],
    });
    const question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
    expect(question.isReady, "question is ready before data").toLooseEqual(true);
    let log = "";
    question.onReadyChanged.add((_, opt) => {
      log += `->${opt.isReady}`;
    });
    const base64Url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII";
    survey.data = {
      signature: base64Url
    };
    expect(question.loadedData).toLooseEqual(base64Url);
    expect(log, "isReady changed only one time").toLooseEqual("->false->true");
  });

  // Skipped: jsdom Image element does not fire onerror for invalid URLs the same way as a real browser, so onReadyChanged sequence does not complete within the timeout.
  test.skip("Check storeDataAsText: false and no download file callback and incorrect link passed", () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;
      const survey = new SurveyModel({
        elements: [
          {
            type: "signaturepad",
            name: "signature",
            storeDataAsText: false,
          }
        ],
      });
      const question = <QuestionSignaturePadModel>survey.getAllQuestions()[0];
      expect(question.isReady, "question is ready before data").toLooseEqual(true);
      let log = "";
      question.onReadyChanged.add((_, opt) => {
        log += `->${opt.isReady}`;
      });
      const url = "http://localhost:7777/image.jpg";
      survey.data = {
        signature: url
      };
      setTimeout(() => {
        expect(question.loadedData).toLooseEqual(undefined);
        expect(question.value).toLooseEqual(url);
        expect(log, "isReady changed only one time").toLooseEqual("->false->true");
        done();
      }, 2500);
    });
  });

  test("Check signature image cached in loadedData and loaded only once until value changed", () => {
    var el = document.createElement("div");
    var canv = document.createElement("canvas");
    el.appendChild(canv);
    const survey = new SurveyModel({
      elements: [
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
      expect(options.question.isReady).toLooseEqual(false);
      contents.push(loadedData[options.question.value]);
      callbacks.push(options.callback);
      log += "->" + options.fileValue;
    });

    expect(log).toLooseEqual("");
    expect(callbacks.length, "No callbacks").toLooseEqual(0);
    expect(question.value).toLooseEqual(undefined);
    expect(question.loadedData).toLooseEqual(undefined);
    expect(question.isReady, "question is ready before data assignment").toLooseEqual(true);

    survey.data = {
      "signature": "file1.svg"
    };
    expect(log).toLooseEqual("->file1.svg");
    expect(callbacks.length, "One callback").toLooseEqual(1);
    expect(question.value).toLooseEqual("file1.svg");
    expect(question.loadedData).toLooseEqual(undefined);
    expect(question.isReady, "question is not ready after data assignment").toLooseEqual(false);
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

    expect(log).toLooseEqual("->file1.svg");
    expect(callbacks.length, "No callbacks").toLooseEqual(0);
    expect(question.value).toLooseEqual("file1.svg");
    expect(question.loadedData, "loadedData after widget initialized").toLooseEqual(loadedData["file1.svg"]);
    expect(dataFromUrlLog, "signaturepad.fromDataURL after widget initialized").toLooseEqual("->" + loadedData["file1.svg"]);
    expect(question.isReady, "question ready after widget initialized").toLooseEqual(true);

    question.signatureWidth = 1000;

    expect(log).toLooseEqual("->file1.svg");
    expect(callbacks.length, "No callbacks").toLooseEqual(0);
    expect(question.value).toLooseEqual("file1.svg");
    expect(question.loadedData, "loadedData after resize").toLooseEqual(loadedData["file1.svg"]);
    expect(dataFromUrlLog, "signaturepad.fromDataURL after resize").toLooseEqual("->" + loadedData["file1.svg"]);
    expect(question.isReady, "question ready after resize").toLooseEqual(true);

    question.value = "file2.svg";
    // survey.data = {
    //   "signature": "file2.svg"
    // };

    expect(log).toLooseEqual("->file1.svg->file2.svg");
    expect(callbacks.length, "One callback").toLooseEqual(1);
    expect(question.value).toLooseEqual("file2.svg");
    expect(question.loadedData, "No data available for a while after value changed").toLooseEqual(undefined);
    expect(dataFromUrlLog, "signaturepad.fromDataURL after resize").toLooseEqual("->" + loadedData["file1.svg"]);
    expect(question.isReady, "question is not ready after data assignment").toLooseEqual(false);
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]("success", contents[i]);
    }
    callbacks.length = 0;

    expect(log).toLooseEqual("->file1.svg->file2.svg");
    expect(callbacks.length, "No callbacks").toLooseEqual(0);
    expect(question.value).toLooseEqual("file2.svg");
    expect(question.loadedData, "Another data loaded").toLooseEqual(loadedData["file2.svg"]);
    expect(dataFromUrlLog, "signaturepad.fromDataURL after value changed").toLooseEqual("->" + loadedData["file1.svg"] + "->" + loadedData["file2.svg"]);
    expect(question.isReady, "question ready after loading data after value changedt").toLooseEqual(true);

    canv.remove();
    el.remove();
  });

  test("do not init in design mode", () => {
    var el = document.createElement("div");
    var json = {
      elements: [
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

    expect(signaturepad["signaturePad"]).toBeFalsy();

    el.remove();
  });
  test("Question Signature showPlaceholder on Error", () => {
    var json = {
      elements: [
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
    var errorIndex = 1;
    survey.onUploadFiles.add((survey, options) => {
      options.callback([], ["Error " + (errorIndex ++)]);
    });

    const el = document.createElement("div");
    el.append(document.createElement("canvas"));
    q1.afterRenderQuestionElement(el);

    expect(!!q1.nothingIsDrawn()).toLooseEqual(true);

    const event = new CustomEvent("beginStroke", { bubbles: true, cancelable: true, detail: {} });
    q1.signaturePad.dispatchEvent(event);

    const event2 = new CustomEvent("endStroke", { bubbles: true, cancelable: true, detail: {} });
    q1.signaturePad.dispatchEvent(event2);

    expect(q1.nothingIsDrawn()).toLooseEqual(false);

    expect(q1.errors.map(e => e.text)).toEqualValues([]);

    q1.valueWasChangedFromLastUpload = true;
    q1.onBlur({ target: null } as any);
    expect(q1.hasDrawnStroke).toBeTruthy();
    expect(q1.nothingIsDrawn()).toLooseEqual(false);
    expect(q1.value).toBeFalsy();
    expect(q1.errors.map(e => e.text)).toEqualValues(["Error 1"]);

    q1.clearValue(true, true);
    expect(q1.value).toBeFalsy();
    expect(q1.nothingIsDrawn()).toLooseEqual(true);
  });
});
