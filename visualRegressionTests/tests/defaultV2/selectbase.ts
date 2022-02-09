import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, checkElementScreenshot } from "../../helper";

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
    await applyTheme(theme);
  });
  test.only("Check checkbox question", async (t) => {
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
    await ClientFunction(()=> { (<any>window).survey.getQuestionByName("checkbox_question").colCount = 2; })();
    await checkElementScreenshot("checkbox-col-count-2.png", Selector(".sd-question"), t);
  });
});