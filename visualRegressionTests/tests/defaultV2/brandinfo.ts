import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, takeElementScreenshot, wrapVisualTest } from "../../helper";

const title = "Brand banner Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const json = {
  showQuestionNumbers: "on",
  showBrandInfo: true,
  questions: [{
    type: "text",
    name: "question1",
  }]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`.beforeEach(async t => {
    await initSurvey(framework, json);
    await ClientFunction(() => {
      document.body.focus();
    })();
  });
  test("Check brand info banner", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);

      const brandInfo = Selector(".sd-body");
      await takeElementScreenshot("brand-info-image.png", brandInfo, t, comparer);
    });
  });
});
