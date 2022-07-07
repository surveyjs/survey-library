import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, explicitErrorHandler } from "../../helper";

const title = "Brand banner Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";
const json = {
  showBrandInfo: true,
  questions: [{
    type: "text",
    name: "question1",
  }]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await explicitErrorHandler();
    await applyTheme(theme);
    await initSurvey(framework, json);
    await ClientFunction(() => {
      document.body.focus();
    })();
  });
  test("Check brand info banner", async (t) => {
    await t.resizeWindow(1920, 1080);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const brandInfo = Selector(".sv-brand-info");
    await takeScreenshot("brand-info-image.png", brandInfo, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
