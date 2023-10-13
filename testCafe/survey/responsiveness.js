import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "Survey responsiveness";

var json = {
  questions: [
    {
      type: "text",
      name: "q1",
    },
  ],
};

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`.beforeEach(async (t) => {
    await applyTheme(themeName);
    await initSurvey(framework, json);
    await t.resizeWindow(1000, 1000);
  });
  test("check survey root class on isMobile switch ", async (t) => {
    await ClientFunction(() => { window.addEventListener("error", e => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
        e.message === "ResizeObserver loop limit exceeded") {
        e.stopImmediatePropagation();
      }
    }); })();
    const rootSelector = Selector(".sd-root-modern");
    const mobileClass = "sd-root-modern--mobile";
    await t.expect(rootSelector.hasClass(mobileClass)).notOk()
      .resizeWindow(500, 1000)
      .expect(rootSelector.hasClass(mobileClass)).ok()
      .resizeWindow(1000, 1000)
      .expect(rootSelector.hasClass(mobileClass)).notOk();
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`.beforeEach(async (t) => {
    await applyTheme(themeName);
  });
  test("check rating question in survey with multiple pages on small screen", async (t) => {
    await ClientFunction(() => { window.addEventListener("error", e => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
        e.message === "ResizeObserver loop limit exceeded") {
        e.stopImmediatePropagation();
      }
    }); })();
    await initSurvey(framework, {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "rating",
              "name": "satisfaction-auto",
              "title": "How satisfied are you with our product?",
              "description": "Display mode = Auto",
              "minRateDescription": "Not satisfied",
              "maxRateDescription": "Completely satisfied"
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "boolean",
              "name": "question2"
            }
          ]
        }
      ],
      "showQuestionNumbers": "off",
      "widthMode": "static",
    });
    const getQuestionRenderAs = ClientFunction(() => {
      return window.survey.getAllQuestions()[1].renderAs;
    });
    await t.resizeWindow(500, 1080)
      .click(Selector(".sd-navigation__next-btn"))
      .expect(getQuestionRenderAs()).eql("dropdown")
      .click(Selector(".sd-navigation__next-btn"))
      .click(Selector(".sd-navigation__prev-btn"))
      .expect(getQuestionRenderAs()).eql("dropdown");
  });
});