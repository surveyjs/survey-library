import { Serializer } from "../src/jsonobject";
import { QuestionSignaturePadModel } from "../src/question_signaturepad";
import { SurveyModel } from "../src/survey";

import { describe, test, expect, vi } from "vitest";
describe("question signaturepad", () => {
  test("QuestionSignaturePadModel dataFormat default value", () => {
    var question = new QuestionSignaturePadModel("q");
    expect(question.dataFormat, "default value").toBe("png");
  });

  test("QuestionSignaturePadModel dataFormat values", () => {
    var question = new QuestionSignaturePadModel("q");
    expect(question.dataFormat, "defaultValue").toBe("png");

    var el = document.createElement("div");
    el.appendChild(document.createElement("canvas"));
    el.appendChild(document.createElement("button"));
    question.initSignaturePad(el);

    question["updateValue"]();
    expect(question.value.substring(0, 15), "png").toBe("data:image/png;");

    question.dataFormat = "image/jpeg";
    expect(question.dataFormat, "jpeg format").toBe("jpeg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "jpeg").toBe("data:image/jpeg");

    question.dataFormat = "image/svg+xml";
    expect(question.dataFormat, "svg format").toBe("svg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "svg").toBe("data:image/svg+");

    question.dataFormat = "jpeg";
    expect(question.dataFormat, "jpeg format").toBe("jpeg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "jpeg#2").toBe("data:image/jpeg");

    question.dataFormat = "svg";
    expect(question.dataFormat, "svg format").toBe("svg");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "svg#2").toBe("data:image/svg+");

    question.dataFormat = "png";
    expect(question.dataFormat, "png format").toBe("png");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "png#2").toBe("data:image/png;");

    question.dataFormat = "";
    expect(question.dataFormat, "png format").toBe("png");
    question["updateValue"]();
    expect(question.value.substring(0, 15), "png#3").toBe("data:image/png;");

    el.remove();
  });
  test("QuestionSignaturePadModel dataFormat converters", () => {
    var question = new QuestionSignaturePadModel("q");
    expect(question.dataFormat, "#1").toBe("png");
    question.fromJSON({ name: "q", dataFormat: "jpeg" });
    expect(question.dataFormat, "#2").toBe("jpeg");
    question.fromJSON({ name: "q", dataFormat: "svg" });
    expect(question.dataFormat, "#3").toBe("svg");
    question.fromJSON({ name: "q", dataFormat: "dffd" });
    expect(question.dataFormat, "#4").toBe("png");
    question.fromJSON({ name: "q", dataFormat: "image/jpeg" });
    expect(question.dataFormat, "#5").toBe("jpeg");
    question.fromJSON({ name: "q", dataFormat: "image/svg+xml" });
    expect(question.dataFormat, "#6").toBe("svg");
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
    expect(signaturepad.allowClear, "allowClear").toBe(true);
    expect(signaturepad.readOnly, "readOnly").toBe(false);
    expect(signaturepad.canShowClearButton, "canShowClearButton").toBe(false);

    signaturepad.valueWasChangedFromLastUpload = true;
    expect(signaturepad.canShowClearButton, "canShowClearButton").toBe(true);
    signaturepad.valueWasChangedFromLastUpload = false;
    expect(signaturepad.canShowClearButton, "canShowClearButton").toBe(false);

    signaturepad.value = "data:image/svg+xml,%3C xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
    expect(signaturepad.canShowClearButton, "canShowClearButton").toBe(true);

    signaturepad.allowClear = false;
    expect(signaturepad.allowClear, "allowClear").toBe(false);
    expect(signaturepad.readOnly, "readOnly").toBe(false);
    expect(signaturepad.canShowClearButton, "canShowClearButton").toBe(false);
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
    expect(signaturepad.signatureWidth).toBe(300);
    expect(signaturepad.signatureHeight).toBe(200);
    expect(canvas.width).toBe(300 * ratio);
    expect(canvas.height).toBe(200 * ratio);
    signaturepad.signatureWidth = 400;
    signaturepad.signatureHeight = 300;
    expect(canvas.width).toBe(400 * ratio);
    expect(canvas.height).toBe(300 * ratio);

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
    expect(signaturepad.signatureWidth).toBe(400);
    expect(signaturepad.signatureHeight).toBe(300);
    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(300);

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
    expect(signaturepad.signatureWidth).toBe(300);
    expect(canvas.width).toBe(300);

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
    expect(signaturepad.signatureWidth).toBe(400);
    expect(canvas.width).toBe(400);
    expect(signaturepad.signatureHeight).toBe(300);
    expect(canvas.height).toBe(300);

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

    expect(signaturepadQuestion.penColor, "penColor init").toBe("#e92525");
    expect(signaturepadQuestion.backgroundColor, "backgroundColor init").toBe("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor init").toBe("#e92525");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor init").toBe("#dde6db");

    survey.applyTheme({ "cssVariables": { "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)" } });
    expect(signaturepadQuestion.penColor, "penColor init").toBe("#e92525");
    expect(signaturepadQuestion.backgroundColor, "backgroundColor init").toBe("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor init").toBe("#e92525");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor init").toBe("#dde6db");

    survey.applyTheme({ "cssVariables": {} });
    expect(signaturepadQuestion.penColor, "penColor init").toBe("#e92525");
    expect(signaturepadQuestion.backgroundColor, "backgroundColor init").toBe("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor init").toBe("#e92525");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor init").toBe("#dde6db");
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
    document.body.appendChild(containerEl);
    let survey = new SurveyModel(json);
    let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
    signaturepadQuestion["element"] = containerEl;
    signaturepadQuestion.initSignaturePad(containerEl);

    expect(signaturepadQuestion.penColor, "penColor undefined").toBeUndefined();
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toBeUndefined();
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor default").toBe("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor default").toBe("#ffffff");

    containerEl.style.setProperty("--sjs2-color-bg-brand-primary", "rgba(103, 58, 176, 1)");
    survey.applyTheme({ "cssVariables": { "--sjs2-color-bg-brand-primary": "rgba(103, 58, 176, 1)" } });
    expect(signaturepadQuestion.penColor, "penColor undefined").toBeUndefined();
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toBeUndefined();
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor from theme").toBe("rgba(103, 58, 176, 1)");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor from theme").toBe("transparent");

    containerEl.style.setProperty("--sjs2-color-bg-brand-primary", "");
    survey.applyTheme({ "cssVariables": {} });
    expect(signaturepadQuestion.penColor, "penColor undefined").toBeUndefined();
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toBeUndefined();
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor default").toBe("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor default").toBe("#ffffff");

    containerEl.remove();
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
    document.body.appendChild(containerEl);
    let survey = new SurveyModel(json);
    let signaturepadQuestion = <QuestionSignaturePadModel>survey.getQuestionByName("q1");
    signaturepadQuestion["element"] = containerEl;
    signaturepadQuestion.initSignaturePad(containerEl);

    expect(signaturepadQuestion.penColor, "penColor undefined").toBeUndefined();
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toBeUndefined();
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor #1ab394").toBe("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor transparent").toBe("transparent");

    containerEl.style.setProperty("--sjs2-color-bg-brand-primary", "rgba(103, 58, 176, 1)");
    survey.applyTheme({ "cssVariables": { "--sjs2-color-bg-brand-primary": "rgba(103, 58, 176, 1)" } });
    expect(signaturepadQuestion.penColor, "penColor undefined").toBeUndefined();
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toBeUndefined();
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor from theme").toBe("rgba(103, 58, 176, 1)");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor from theme").toBe("transparent");

    containerEl.style.setProperty("--sjs2-color-bg-brand-primary", "");
    survey.applyTheme({ "cssVariables": {} });
    expect(signaturepadQuestion.penColor, "penColor undefined").toBeUndefined();
    expect(signaturepadQuestion.backgroundColor, "backgroundColor undefined").toBeUndefined();
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor #1ab394").toBe("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor transparent").toBe("transparent");

    signaturepadQuestion.backgroundColor = "#dde6db";
    expect(signaturepadQuestion.penColor, "penColor undefined").toBeUndefined();
    expect(signaturepadQuestion.backgroundColor, "backgroundColor #dde6db").toBe("#dde6db");
    expect(signaturepadQuestion.signaturePad.penColor, "signaturePad.penColor #1ab394").toBe("#1ab394");
    expect(signaturepadQuestion.signaturePad.backgroundColor, "signaturePad.backgroundColor transparent").toBe("transparent");

    containerEl.remove();
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
    expect(question.locPlaceholder.renderedHtml).toBe("Sign here");
    expect(question.locRenderedPlaceholder.renderedHtml).toBe("Sign here");

    question.valueWasChangedFromLastUpload = true;
    expect(question.needShowPlaceholder(), "#1").toBe(false);
    question.valueWasChangedFromLastUpload = false;
    expect(question.needShowPlaceholder()).toBe(true), "#2";

    question.value = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
    expect(question.needShowPlaceholder(), "#3").toBe(false);

    question.showPlaceholder = false;
    expect(question.needShowPlaceholder(), "#4").toBeFalsy();
    question.placeholder = "test sign";
    expect(question.locPlaceholder.renderedHtml).toBe("test sign");

    expect(question.locRenderedPlaceholder.renderedHtml).toBe("test sign");
    question.readOnly = true;
    expect(question.locRenderedPlaceholder.renderedHtml).toBe("No signature");
    question.placeholderReadOnly = "empty sign";
    expect(question.locRenderedPlaceholder.renderedHtml).toBe("empty sign");

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
    expect(question.locPlaceholder.renderedHtml).toBe("test sign");
  });

  test("check placeholder property visibility", () => {
    const prop1 = Serializer.getProperty("signaturepad", "placeholder");
    const prop2 = Serializer.getProperty("signaturepad", "placeholderReadOnly");
    expect(Serializer.getProperty("signaturepad", "showPlaceholder").getDependedProperties()).toEqual([prop1.name, prop2.name]);
    const q1 = new QuestionSignaturePadModel("q1");
    q1.showPlaceholder = true;
    expect(prop1.isVisible(undefined, q1)).toBe(true);
    q1.showPlaceholder = false;
    expect(prop1.isVisible(undefined, q1)).toBe(false);
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

    expect(signaturepadQuestion.renderedCanvasWidth).toBe("300px");

    signaturepadQuestion.signatureWidth = 500;

    expect(signaturepadQuestion.renderedCanvasWidth).toBe("500px");

    signaturepadQuestion.signatureAutoScaleEnabled = true;
    expect(signaturepadQuestion.renderedCanvasWidth).toBe("100%");
  });

  test("Question Signature upload files", async () => {
    vi.useFakeTimers();
    try {
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

      let valueChanged = false;
      survey.onValueChanged.add((survey, options) => {
        valueChanged = true;
        expect(q1.value).toBe("signature.svg_url");
        expect(eventFired).toBeTruthy();
        expect(fileLoaded).toBeTruthy();

        expect(fileType).toBe("image/svg+xml");
        expect(fileName).toBe("signature.svg");
        expect(fileContent).toBe("data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + width + " " + height + '" width="' + width + '" height="' + height + '"><circle r="1.5" cx="9" cy="11" fill="rgba(25, 179, 148, 1)"></circle><circle r="1.5" cx="15" cy="18" fill="rgba(25, 179, 148, 1)"></circle></svg>'));
      });
      await vi.advanceTimersByTimeAsync(100);
      expect(valueChanged, "onValueChanged fired").toBe(true);
    } finally {
      vi.useRealTimers();
    }
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

    expect(q1.errors.map(e => e.text)).toEqual(["Error 1"]);
    q1.valueWasChangedFromLastUpload = true;
    q1.onBlur({ target: null } as any);
    expect(q1.errors.map(e => e.text)).toEqual(["Error 2"]);
  });

  test("Question Signature upload files - and complete", async () => {
    vi.useFakeTimers();
    try {
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
      let completed = false;
      survey.onComplete.add((survey, options) => {
        completed = true;
        expect(filesLoaded).toBeTruthy();
      });

      q1.onBlur({ target: null } as any);
      survey.navigationBar.getActionById("sv-nav-complete").action();
      await vi.advanceTimersByTimeAsync(2);
      expect(completed, "survey completed").toBe(true);
    } finally {
      vi.useRealTimers();
    }
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
    expect(survey.data).toEqual({ text: "abc" });
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

    expect(q.currentState, "Initial state is empty").toBe("empty");
    survey.data = {
      "signature": "file1.png"
    };
    expect(log, "file should be loaded only once").toBe("->file1.png");
    expect(q.currentState, "The loaded state after data assigned").toBe("loaded");

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
    expect(question.isReady, "question is ready before init").toBe(true);
    question.initSignaturePad(el);
    expect(question.isReady, "question is ready after init").toBe(true);
    let log = "";
    const callbacks = new Array<any>();
    const contents = new Array<string>();
    survey.onDownloadFile.add((survey, options) => {
      expect(options.question.isReady).toBe(false);
      contents.push("data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'));
      callbacks.push(options.callback);
      log += "->" + options.fileValue;
    });
    const readyLogs = new Array<boolean>();
    question.onReadyChanged.add(() => {
      readyLogs.push(question.isReady);
    });
    expect(question.isReady, "question is ready before data assignment").toBe(true);
    survey.data = {
      "signature": "file1.svg"
    };
    expect(question.isReady, "question is not ready").toBe(false);
    expect(log).toBe("->file1.svg");
    expect(callbacks.length, "One callback").toBe(1);
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]("success", contents[i]);
    }
    expect(question.isReady, "question is ready").toBe(true);
    expect(readyLogs.length, "readyLogs.length").toBe(2);
    expect(readyLogs[0], "readyLogs[0]").toBe(false);
    expect(readyLogs[1], "readyLogs[1]").toBe(true);

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
    expect(question.isReady, "question is ready before data").toBe(true);
    let log = "";
    question.onReadyChanged.add((_, opt) => {
      log += `->${opt.isReady}`;
    });
    const base64Url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII";
    survey.data = {
      signature: base64Url
    };
    expect(question.loadedData).toBe(base64Url);
    expect(log, "isReady changed only one time").toBe("->false->true");
  });

  // jsdom's HTMLImageElement does not fire `onerror` for unreachable URLs the
  // same way a real browser does. Stub `window.Image` so an `onerror` event is
  // dispatched immediately when `src` is assigned, mirroring the production
  // `onReadyChanged` sequence the original Karma test relied on.
  test("Check storeDataAsText: false and no download file callback and incorrect link passed", async () => {
    vi.useFakeTimers();
    const OriginalImage = (window as any).Image;
    class StubImage {
      public crossOrigin: string = "";
      public onload: ((ev: Event) => void) | null = null;
      public onerror: ((ev: Event) => void) | null = null;
      private _src: string = "";
      get src(): string { return this._src; }
      set src(v: string) {
        this._src = v;
        if (!v || /^https?:\/\//i.test(v) || v === "invalid-link") {
          queueMicrotask(() => { this.onerror && this.onerror(new Event("error")); });
        } else {
          queueMicrotask(() => { this.onload && this.onload(new Event("load")); });
        }
      }
    }
    Object.defineProperty(window, "Image", { configurable: true, writable: true, value: StubImage });
    try {
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
      expect(question.isReady, "question is ready before data").toBe(true);
      let log = "";
      question.onReadyChanged.add((_, opt) => {
        log += `->${opt.isReady}`;
      });
      const url = "http://localhost:7777/image.jpg";
      survey.data = {
        signature: url
      };
      await vi.advanceTimersByTimeAsync(50);
      expect(question.loadedData).toBeUndefined();
      expect(question.value).toBe(url);
      expect(log, "isReady changed only one time").toBe("->false->true");
    } finally {
      Object.defineProperty(window, "Image", { configurable: true, writable: true, value: OriginalImage });
      vi.useRealTimers();
    }
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
      expect(options.question.isReady).toBe(false);
      contents.push(loadedData[options.question.value]);
      callbacks.push(options.callback);
      log += "->" + options.fileValue;
    });

    expect(log).toBe("");
    expect(callbacks.length, "No callbacks").toBe(0);
    expect(question.value).toBeUndefined();
    expect(question.loadedData).toBeUndefined();
    expect(question.isReady, "question is ready before data assignment").toBe(true);

    survey.data = {
      "signature": "file1.svg"
    };
    expect(log).toBe("->file1.svg");
    expect(callbacks.length, "One callback").toBe(1);
    expect(question.value).toBe("file1.svg");
    expect(question.loadedData).toBeUndefined();
    expect(question.isReady, "question is not ready after data assignment").toBe(false);
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

    expect(log).toBe("->file1.svg");
    expect(callbacks.length, "No callbacks").toBe(0);
    expect(question.value).toBe("file1.svg");
    expect(question.loadedData, "loadedData after widget initialized").toBe(loadedData["file1.svg"]);
    expect(dataFromUrlLog, "signaturepad.fromDataURL after widget initialized").toBe("->" + loadedData["file1.svg"]);
    expect(question.isReady, "question ready after widget initialized").toBe(true);

    question.signatureWidth = 1000;

    expect(log).toBe("->file1.svg");
    expect(callbacks.length, "No callbacks").toBe(0);
    expect(question.value).toBe("file1.svg");
    expect(question.loadedData, "loadedData after resize").toBe(loadedData["file1.svg"]);
    expect(dataFromUrlLog, "signaturepad.fromDataURL after resize").toBe("->" + loadedData["file1.svg"]);
    expect(question.isReady, "question ready after resize").toBe(true);

    question.value = "file2.svg";
    // survey.data = {
    //   "signature": "file2.svg"
    // };

    expect(log).toBe("->file1.svg->file2.svg");
    expect(callbacks.length, "One callback").toBe(1);
    expect(question.value).toBe("file2.svg");
    expect(question.loadedData, "No data available for a while after value changed").toBeUndefined();
    expect(dataFromUrlLog, "signaturepad.fromDataURL after resize").toBe("->" + loadedData["file1.svg"]);
    expect(question.isReady, "question is not ready after data assignment").toBe(false);
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]("success", contents[i]);
    }
    callbacks.length = 0;

    expect(log).toBe("->file1.svg->file2.svg");
    expect(callbacks.length, "No callbacks").toBe(0);
    expect(question.value).toBe("file2.svg");
    expect(question.loadedData, "Another data loaded").toBe(loadedData["file2.svg"]);
    expect(dataFromUrlLog, "signaturepad.fromDataURL after value changed").toBe("->" + loadedData["file1.svg"] + "->" + loadedData["file2.svg"]);
    expect(question.isReady, "question ready after loading data after value changedt").toBe(true);

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

    expect(!!q1.nothingIsDrawn()).toBe(true);

    const event = new CustomEvent("beginStroke", { bubbles: true, cancelable: true, detail: {} });
    q1.signaturePad.dispatchEvent(event);

    const event2 = new CustomEvent("endStroke", { bubbles: true, cancelable: true, detail: {} });
    q1.signaturePad.dispatchEvent(event2);

    expect(q1.nothingIsDrawn()).toBe(false);

    expect(q1.errors.map(e => e.text)).toEqual([]);

    q1.valueWasChangedFromLastUpload = true;
    q1.onBlur({ target: null } as any);
    expect(q1.hasDrawnStroke).toBeTruthy();
    expect(q1.nothingIsDrawn()).toBe(false);
    expect(q1.value).toBeFalsy();
    expect(q1.errors.map(e => e.text)).toEqual(["Error 1"]);

    q1.clearValue(true, true);
    expect(q1.value).toBeFalsy();
    expect(q1.nothingIsDrawn()).toBe(true);
  });
});
