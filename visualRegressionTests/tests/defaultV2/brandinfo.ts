import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest } from "../../helper";

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
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
    await initSurvey(framework, json);
    await ClientFunction(() => {
      document.body.focus();
    })();
  });
  test("Check brand info banner", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);

      const brandInfo = Selector(".sv-brand-info");
      await takeElementScreenshot("brand-info-image.png", brandInfo, t, comparer);
    });
  });
});
