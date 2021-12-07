import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test } from "../../helper";

const title = "Paneldynamic Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

var json = {
  questions: [
    {
      type: "text",
      name: "question_with_num",
      width: "708px",
      title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
    },
  ]
};

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await applyTheme(theme);
    await initSurvey(framework, json);
  });
  test("Check question num", async (t) => {
    await t.resizeWindow(1920, 1080);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await takeScreenshot("question-with-num.png", questionRoot, screenshotComparerOptions);
    await t
      .debug()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});