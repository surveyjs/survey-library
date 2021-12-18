import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test } from "../../helper";

const title = "Paneldynamic Screenshot";

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
  test("Matrixdynamic empty placeholder", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdynamic",
          name: "frameworks",
          title: "Please tells us your opinion about JavaScript MVVM frameworks.",
          hideColumnsIfEmpty: true,
          emptyRowsText: "There is no records yet.\nClick the button below to add a new record.",
          addRowText: "Add New Record",
          rowCount: 0
        }
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const matrixdynamicRoot = Selector(".sd-question");
    await takeScreenshot("matrixdynamic-empty.png", matrixdynamicRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
