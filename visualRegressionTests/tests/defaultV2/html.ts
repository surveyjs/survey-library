import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test } from "../../helper";

const title = "Question Screenshot";

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
  test("Check html question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "html",
          name: "html_question",
          html: "<b>Hello, world!</b><p>Hello, world!</p><b>Hello, world!</b>"
        },
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question--html");
    await takeScreenshot("html-question.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});