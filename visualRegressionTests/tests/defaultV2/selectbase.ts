import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler } from "../../helper";

const title = "Selectbase Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await explicitErrorHandler();
    await applyTheme(theme);
  });
  test("Check checkbox question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "checkbox",
          title: "Which cities have you visited?",
          name: "checkbox_question",
          choices: ["Moscow", "Paris", "Madrid", "Munich", "London", "None"],
          colCount: 1
        },
      ]
    });
    await ClientFunction(() => { document.body.focus(); })();
    await checkElementScreenshot("checkbox-col-count-1.png", Selector(".sd-question"), t);
    await ClientFunction(() => { (<any>window).survey.getQuestionByName("checkbox_question").colCount = 2; })();
    await checkElementScreenshot("checkbox-col-count-2.png", Selector(".sd-question"), t);
    await ClientFunction(() => { (<any>window).survey.getQuestionByName("checkbox_question").colCount = 0; })();
    await checkElementScreenshot("checkbox-col-count-0.png", Selector(".sd-question"), t);
  });
  test("Check radiogroup question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          "type": "radiogroup",
          "name": "car",
          "title": "What car are you driving?",
          "hasNone": true,
          "colCount": 0,
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    });
    await ClientFunction(() => { document.body.focus(); })();
    await checkElementScreenshot("radiogroup-col-count-0.png", Selector(".sd-question"), t);
    await ClientFunction(() => { (<any>window).survey.getQuestionByName("checkbox_question").colCount = 4; })();
    await checkElementScreenshot("radiogroup-col-count-4.png", Selector(".sd-question"), t);
    await ClientFunction(() => { (window as any).survey.getAllQuestions()[0].showClearButton = true; })();
    await checkElementScreenshot("radiogroup-clear-button", Selector(".sd-question"), t);
  });
});
