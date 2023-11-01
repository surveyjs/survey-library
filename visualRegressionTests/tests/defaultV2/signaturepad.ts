import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Html Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
      await applyTheme(theme);
    });
  test("Sgnature resize to mobile", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            signatureWidth: 500,
            signatureHeight: 100
          },
        ]
      });
      await t.click("canvas", { offsetX: 50, offsetY: 80 });
      await t.click("canvas", { offsetX: 70, offsetY: 50 });
      await t.click("canvas", { offsetX: 90, offsetY: 20 });
      await t.wait(100);

      await takeElementScreenshot("signature.png", ".sd-question", t, comparer);
      await t.resizeWindow(375, 400);
      await t.click("canvas", { offsetX: 50, offsetY: 10 });
      await t.click("canvas", { offsetX: 70, offsetY: 20 });
      await t.click("canvas", { offsetX: 90, offsetY: 30 });
      await t.wait(100);
      await takeElementScreenshot("signature-mobile.png", ".sd-question", t, comparer);
    });
  });
});