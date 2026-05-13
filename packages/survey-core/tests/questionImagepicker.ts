import { SurveyModel } from "../src/survey";
import { ImageItemValue, QuestionImagePickerModel } from "../src/question_imagepicker";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { setOldTheme } from "./oldTheme";

import { describe, test, expect } from "vitest";
test("Add choices in runtime", () => {
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

  expect(question.choices.length, "2 choices").toBe(2);
  expect(question.choices[0].getType(), "choice type is imageitemvalue").toBe("imageitemvalue");
  expect(question.choices[1].imageLink, "choice imageLink value").toBe("link2");
});

test("Localized imageLink", () => {
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

  expect(question.choices.length, "2 choices").toBe(2);
  expect(question.choices[1].imageLink, "choice imageLink default langiage value").toBe("link2");

  survey.locale = "de";
  expect(question.choices[1].imageLink, "choice imageLink DE langiage value").toBe("link2de");
  survey.locale = "";
});

test("check dependency getItemClass method on colCount", () => {
  let survey = new SurveyModel({});
  setOldTheme(survey);
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  question.choices = [{ value: "item1" }, { value: "item2" }];
  const item = question.visibleChoices[0];
  expect(question.getItemClass(item)).toBe("sv_q_imgsel sv_q_imagepicker_inline");
});
test("check process responsiveness for imagepicker, colCount == 0", () => {
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
  expect(question.renderedImageWidth).toBe(100);
  expect(question.renderedImageHeight).toBe(50);

  question["processResponsiveness"](0, 548);
  expect(question.renderedImageWidth).toBe(125);
  expect(question["responsiveImageHeight"]).toBe(62.5);
  expect(question.renderedImageHeight).toBe(62);

  question["processResponsiveness"](0, 900);
  expect(question.renderedImageWidth).toBe(200);
  expect(question.renderedImageHeight).toBe(100);
});

test("check process responsiveness for imagepicker, colCount !== 0", () => {
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
  expect(question["getCurrentColCount"]()).toBe(3);
  expect(question.renderedImageWidth).toBe(100);
  expect(question.renderedImageHeight).toBe(50);

  question["processResponsiveness"](0, 900);
  expect(question["getCurrentColCount"]()).toBe(3);
  expect(question.renderedImageWidth).toBe(200);
  expect(question.renderedImageHeight).toBe(100);

  question["processResponsiveness"](0, 216);
  expect(question["getCurrentColCount"]()).toBe(2);
  expect(question.renderedImageWidth).toBe(100);
  expect(question.renderedImageHeight).toBe(50);

  question["processResponsiveness"](0, 100);
  expect(question["getCurrentColCount"]()).toBe(1);
  expect(question.renderedImageWidth).toBe(100);
  expect(question.renderedImageHeight).toBe(50);
});

test("check isResponsive getter", () => {
  let survey = new SurveyModel({});
  survey.css = defaultCss;
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  expect(question["isResponsive"]).toBeTruthy();
  question.imageWidth = 200;
  expect(question["isResponsive"]).toBeFalsy();
  question.imageWidth = undefined;
  question.imageHeight = 150;
  expect(question["isResponsive"]).toBeFalsy();
});

test("check isResponsive getter after end of loading json", () => {
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
  expect(q.isResponsive).toBeFalsy();
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
  expect(q.isResponsive).toBeTruthy();
});

import { CustomResizeObserver } from "./test-helpers";

test("check resizeObserver behavior", () => {
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
  // jsdom does not perform layout, so isContainerVisible() always returns false.
  // Stub offsetWidth on the element queried by the responsive logic (contentEl).
  Object.defineProperty(contentEl, "offsetWidth", { configurable: true, value: 100 });

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
  expect(trace).toBe("->processed");
  (<any>q["resizeObserver"]).call();
  expect(trace, "prevent from double call").toBe("->processed");
  (<any>q["resizeObserver"]).call();
  expect(trace).toBe("->processed->processed");
  survey.setIsMobile(true);
  expect(trace, "always process when isMobile changed").toBe("->processed->processed->processed");
  window.ResizeObserver = ResizeObserver;
  window.setTimeout = setTimeout;

  contentEl.remove();
  rootEl.remove();
});

test("check resizeObserver not process if container is not visible", () => {
  window.requestAnimationFrame = (func: any) => !!func && func();
  const ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = <any>CustomResizeObserver;
  const rootEl = document.createElement("div");
  const contentEl = document.createElement("div");
  contentEl.className = "sd-selectbase sd-imagepicker";
  rootEl.appendChild(contentEl);

  window.document.body.appendChild(rootEl);
  // jsdom does not perform layout. Make contentEl.offsetWidth reflect rootEl's display style
  // so isContainerVisible() correctly reports visible/invisible based on display:none/block.
  Object.defineProperty(contentEl, "offsetWidth", {
    configurable: true,
    get() { return rootEl.style.display === "none" ? 0 : 100; },
  });

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
  expect(trace, "do not process responsivness on invisible container").toBe("");
  rootEl.style.display = "block";
  (<any>q["resizeObserver"]).call();
  expect(trace, "process responsivness on visible container").toBe("->processed");
  window.ResizeObserver = ResizeObserver;

  contentEl.remove();
  rootEl.remove();
});

test("check contentNotLoaded and contentMode flags behavior", () => {
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
  expect(choice.contentNotLoaded).toBeFalsy();
  question.onContentLoaded(choice, { target: {} });
  expect(choice.contentNotLoaded).toBeFalsy();
  question.contentMode = "video";
  choice.onErrorHandler();
  expect(choice.contentNotLoaded).toBeTruthy();
  question.contentMode = "image";
  expect(choice.contentNotLoaded).toBeFalsy();
  question.contentMode = "video";
  expect(choice.contentNotLoaded).toBeTruthy();
});

test("check reCalcGap", () => {
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

  expect(question["reCalcGapBetweenItemsCallback"]).toBeFalsy();
  question.afterRender(container);
  expect(!!question["reCalcGapBetweenItemsCallback"]).toBeTruthy();

  question["reCalcGapBetweenItemsCallback"] = undefined as any;
  question.cssClasses.root = "";
  question.afterRender(container);
  expect(!!question["reCalcGapBetweenItemsCallback"]).toBeFalsy();

  container.innerHTML = "";
  survey.cssClasses.root = "some-class";
  question.afterRender(container);
  expect(!!question["reCalcGapBetweenItemsCallback"]).toBeFalsy();
});

test("supports survey width scale", () => {
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

  expect(question["isResponsiveValue"]).toBeTruthy();
  expect(question["isResponsive"]).toBeTruthy();

  expect(survey.widthScale).toBe(100);
  expect(question.renderedImageWidth).toBe(200);
  expect(question.renderedImageHeight).toBe(150);

  survey.widthScale = 75;
  expect(survey.widthScale).toBe(75);
  expect(question.renderedImageWidth).toBe(150);
  expect(question.renderedImageHeight).toBe(112.5);

  survey.widthScale = 100;
  expect(survey.widthScale).toBe(100);
  question["processResponsiveness"](0, 600);
  expect(question.renderedImageWidth).toBe(600);
  expect(question.renderedImageHeight).toBe(133);

  question["processResponsiveness"](0, 100);
  expect(question.renderedImageWidth).toBe(3000);
  expect(question.renderedImageHeight).toBe(133);

  survey.widthScale = 75;
  question["processResponsiveness"](0, 100);
  expect(survey.widthScale).toBe(75);
  expect(question.renderedImageWidth).toBe(2250);
  expect(question.renderedImageHeight).toBe(99);

  question["processResponsiveness"](0, 600);
  expect(question.renderedImageWidth).toBe(600);
  expect(question.renderedImageHeight).toBe(99);

  question.imageWidth = 150;
  question.imageHeight = 100;
  expect(question.renderedImageWidth).toBe(112.5);
  expect(question.renderedImageHeight).toBe(75);
});

test("inputRequiredAttribute", () => {
  const q = new QuestionImagePickerModel("q");
  expect(q.inputRequiredAttribute).toBeNull();
  q.isRequired = true;
  expect(q.inputRequiredAttribute).toBeNull();
  q.multiSelect = true;
  expect(q.inputRequiredAttribute).toBe(true);
  q.isRequired = false;
  expect(q.inputRequiredAttribute).toBe(false);
});