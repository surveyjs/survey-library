import { SurveyModel } from "../src/survey";
import { ImageItemValue, QuestionImagePickerModel } from "../src/question_imagepicker";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { setOldTheme } from "./oldTheme";

export default QUnit.module("imagepicker");

QUnit.test("Add choices in runtime", function (assert) {
  let survey = new SurveyModel({});
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");

  let choicesJSON = [
    {
      value: "giraffe",
      imageLink: "link1",
    },
    {
      value: "item2",
      imageLink: "link2",
    },
  ];
  question.choices = choicesJSON;

  assert.equal(question.choices.length, 2, "2 choices");
  assert.equal(
    question.choices[0].getType(),
    "imageitemvalue",
    "choice type is imageitemvalue"
  );
  assert.equal(
    question.choices[1].imageLink,
    "link2",
    "choice imageLink value"
  );
});

QUnit.test("Localized imageLink", function (assert) {
  let survey = new SurveyModel({});
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");

  let choicesJSON = [
    {
      value: "giraffe",
      imageLink: {
        default: "link1",
        de: "link1de",
      },
    },
    {
      value: "item2",
      imageLink: {
        default: "link2",
        de: "link2de",
      },
    },
  ];
  question.choices = choicesJSON;

  assert.equal(question.choices.length, 2, "2 choices");
  assert.equal(
    question.choices[1].imageLink,
    "link2",
    "choice imageLink default langiage value"
  );

  survey.locale = "de";
  assert.equal(
    question.choices[1].imageLink,
    "link2de",
    "choice imageLink DE langiage value"
  );
  survey.locale = "";
});

QUnit.test("check dependency getItemClass method on colCount", function (
  assert
) {
  let survey = new SurveyModel({});
  setOldTheme(survey);
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  question.choices = [{ value: "item1" }, { value: "item2" }];
  const item = question.visibleChoices[0];
  assert.equal(
    question.getItemClass(item),
    "sv_q_imgsel sv_q_imagepicker_inline"
  );
});
QUnit.test("check process responsiveness for imagepicker, colCount == 0", function (assert) {
  let survey = new SurveyModel({});
  survey.css = defaultCss;
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  question.choices = [{ value: "item1" }, { value: "item2" }, { value: "item3" }, { value: "item4" }];
  question.choices[0]["aspectRatio"] = question.choices[1]["aspectRatio"] = question.choices[2]["aspectRatio"] = 2;
  question.choices[3]["aspectRatio"] = 3;
  question["gapBetweenItems"] = 16;
  question.minImageWidth = 100;
  question.maxImageWidth = 200;
  question.minImageHeight = 50;
  question.maxImageHeight = 100;
  question["processResponsiveness"](0, 332);
  assert.equal(question.renderedImageWidth, 100);
  assert.equal(question.renderedImageHeight, 50);

  question["processResponsiveness"](0, 548);
  assert.equal(question.renderedImageWidth, 125);
  assert.equal(question["responsiveImageHeight"], 62.5);
  assert.equal(question.renderedImageHeight, 62);

  question["processResponsiveness"](0, 900);
  assert.equal(question.renderedImageWidth, 200);
  assert.equal(question.renderedImageHeight, 100);
});

QUnit.test("check process responsiveness for imagepicker, colCount !== 0", function (assert) {
  let survey = new SurveyModel({});
  survey.css = defaultCss;
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  question.choices = [{ value: "item1" }, { value: "item2" }, { value: "item3" }, { value: "item4" }];
  question.choices[0]["aspectRatio"] = question.choices[1]["aspectRatio"] = question.choices[2]["aspectRatio"] = 2;
  question.choices[3]["aspectRatio"] = 3;
  question["gapBetweenItems"] = 16;
  question.colCount = 3;
  question.minImageWidth = 100;
  question.maxImageWidth = 200;
  question.minImageHeight = 50;
  question.maxImageHeight = 100;
  question["processResponsiveness"](0, 332);
  assert.equal(question["getCurrentColCount"](), 3);
  assert.equal(question.renderedImageWidth, "100");
  assert.equal(question.renderedImageHeight, "50");

  question["processResponsiveness"](0, 900);
  assert.equal(question["getCurrentColCount"](), 3);
  assert.equal(question.renderedImageWidth, "200");
  assert.equal(question.renderedImageHeight, "100");

  question["processResponsiveness"](0, 216);
  assert.equal(question["getCurrentColCount"](), 2);
  assert.equal(question.renderedImageWidth, "100");
  assert.equal(question.renderedImageHeight, "50");

  question["processResponsiveness"](0, 100);
  assert.equal(question["getCurrentColCount"](), 1);
  assert.equal(question.renderedImageWidth, "100");
  assert.equal(question.renderedImageHeight, "50");
});

QUnit.test("check isResponsive getter", function (assert) {
  let survey = new SurveyModel({});
  survey.css = defaultCss;
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  assert.ok(question["isResponsive"]);
  question.imageWidth = 200;
  assert.notOk(question["isResponsive"]);
  question.imageWidth = undefined;
  question.imageHeight = 150;
  assert.notOk(question["isResponsive"]);
});

QUnit.test("check isResponsive getter after end of loading json", function (assert) {
  let survey = new SurveyModel(
    {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question2",
          "choices": [
            {
              "value": "lion",
              "imageLink": "test"
            },
          ],
          imageWidth: 200,
          imageHeight: 150,
        }
      ]
    }
  );
  survey.css = defaultCss;
  let q = survey.getAllQuestions()[0];
  assert.notOk(q.isResponsive);
  survey = new SurveyModel(
    {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question2",
          "choices": [
            {
              "value": "lion",
              "imageLink": "test"
            },
          ],
        }
      ]
    }
  );
  survey.css = defaultCss;
  q = survey.getAllQuestions()[0];
  assert.ok(q.isResponsive);
});

export class CustomResizeObserver {
  constructor(private callback: () => void) { }
  observe() {
    this.call();
  }
  call() {
    this.callback();
  }
  disconnect() { }
}

QUnit.test("check resizeObserver behavior", function (assert) {
  window.requestAnimationFrame = (func: any) => !!func && func();
  const ResizeObserver = window.ResizeObserver;
  const setTimeout = window.setTimeout;
  window.ResizeObserver = <any>CustomResizeObserver;
  window.setTimeout = <any>((f) => f());
  const rootEl = document.createElement("div");
  const contentEl = document.createElement("div");
  contentEl.className = "sd-selectbase sd-imagepicker";
  rootEl.appendChild(contentEl);

  window.document.body.appendChild(rootEl);

  const survey = new SurveyModel(
    {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question2",
          "choices": [
            {
              "value": "lion",
              "imageLink": "test"
            },
          ],
        }
      ]
    }
  );
  survey.css = defaultCss;
  const q = survey.getAllQuestions()[0];
  let trace = "";
  q["processResponsiveness"] = () => {
    trace += "->processed";
    return true;
  };
  q.afterRender(rootEl);
  assert.equal(trace, "->processed");
  (<any>q["resizeObserver"]).call();
  assert.equal(trace, "->processed", "prevent from double call");
  (<any>q["resizeObserver"]).call();
  assert.equal(trace, "->processed->processed");
  survey.setIsMobile(true);
  assert.equal(trace, "->processed->processed->processed", "always process when isMobile changed");
  window.ResizeObserver = ResizeObserver;
  window.setTimeout = setTimeout;

  contentEl.remove();
  rootEl.remove();
});

QUnit.test("check resizeObserver not process if container is not visible", function (assert) {
  window.requestAnimationFrame = (func: any) => !!func && func();
  const ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = <any>CustomResizeObserver;
  const rootEl = document.createElement("div");
  const contentEl = document.createElement("div");
  contentEl.className = "sd-selectbase sd-imagepicker";
  rootEl.appendChild(contentEl);

  window.document.body.appendChild(rootEl);

  const survey = new SurveyModel(
    {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question2",
          "choices": [
            {
              "value": "lion",
              "imageLink": "test"
            },
          ],
        }
      ]
    }
  );
  survey.css = defaultCss;
  const q = survey.getAllQuestions()[0];
  let trace = "";
  q["processResponsiveness"] = () => {
    trace += "->processed";
    return true;
  };
  rootEl.style.display = "none";
  q.afterRender(rootEl);
  assert.equal(trace, "", "do not process responsivness on invisible container");
  rootEl.style.display = "block";
  (<any>q["resizeObserver"]).call();
  assert.equal(trace, "->processed", "process responsivness on visible container");
  window.ResizeObserver = ResizeObserver;

  contentEl.remove();
  rootEl.remove();
});

QUnit.test("check contentNotLoaded and contentMode flags behavior", function (assert) {
  const survey = new SurveyModel(
    {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question2",
          "choices": [
            {
              "value": "lion",
              "imageLink": "test"
            },
          ],
        }
      ]
    }
  );
  const question = <QuestionImagePickerModel>survey.getAllQuestions()[0];
  const choice = <ImageItemValue>question.visibleChoices[0];
  assert.notOk(choice.contentNotLoaded);
  question.onContentLoaded(choice, { target: {} });
  assert.notOk(choice.contentNotLoaded);
  question.contentMode = "video";
  choice.onErrorHandler();
  assert.ok(choice.contentNotLoaded);
  question.contentMode = "image";
  assert.notOk(choice.contentNotLoaded);
  question.contentMode = "video";
  assert.ok(choice.contentNotLoaded);
});

QUnit.test("check reCalcGap", function (assert) {
  const survey = new SurveyModel(
    {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question2",
          "choices": [
            {
              "value": "lion",
              "imageLink": "test"
            },
          ],
        }
      ]
    }
  );
  const question = <QuestionImagePickerModel>survey.getAllQuestions()[0];
  survey.css = defaultCss;
  const container = document.createElement("div");
  const itemsContainer = document.createElement("div");
  itemsContainer.className = survey.css.imagepicker.root;
  container.appendChild(itemsContainer);

  assert.notOk(question["reCalcGapBetweenItemsCallback"]);
  question.afterRender(container);
  assert.ok(!!question["reCalcGapBetweenItemsCallback"]);

  question["reCalcGapBetweenItemsCallback"] = undefined as any;
  question.cssClasses.root = "";
  question.afterRender(container);
  assert.notOk(!!question["reCalcGapBetweenItemsCallback"]);

  container.innerHTML = "";
  survey.cssClasses.root = "some-class";
  question.afterRender(container);
  assert.notOk(!!question["reCalcGapBetweenItemsCallback"]);
});

QUnit.test("supports survey width scale", function (assert) {
  const survey = new SurveyModel(
    {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question1",
          "choices": [
            {
              "value": "lion",
              "imageLink": "test"
            },
          ],
        }
      ]
    }
  );
  survey.css = defaultCss;
  const question = <QuestionImagePickerModel>survey.getAllQuestions()[0];

  assert.ok(question.isDefaultV2Theme);
  assert.ok(question["isResponsiveValue"]);
  assert.ok(question["isResponsive"]);

  assert.equal(survey.widthScale, 100);
  assert.equal(question.renderedImageWidth, 200);
  assert.equal(question.renderedImageHeight, 150);

  survey.widthScale = 75;
  assert.equal(survey.widthScale, 75);
  assert.equal(question.renderedImageWidth, 150);
  assert.equal(question.renderedImageHeight, 112.5);

  survey.widthScale = 100;
  assert.equal(survey.widthScale, 100);
  question["processResponsiveness"](0, 600);
  assert.equal(question.renderedImageWidth, 600);
  assert.equal(question.renderedImageHeight, 133);

  question["processResponsiveness"](0, 100);
  assert.equal(question.renderedImageWidth, 3000);
  assert.equal(question.renderedImageHeight, 133);

  survey.widthScale = 75;
  question["processResponsiveness"](0, 100);
  assert.equal(survey.widthScale, 75);
  assert.equal(question.renderedImageWidth, 2250);
  assert.equal(question.renderedImageHeight, 99);

  question["processResponsiveness"](0, 600);
  assert.equal(question.renderedImageWidth, 600);
  assert.equal(question.renderedImageHeight, 99);

  question.imageWidth = 150;
  question.imageHeight = 100;
  assert.equal(question.renderedImageWidth, 112.5);
  assert.equal(question.renderedImageHeight, 75);
});