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
  test("Signature resize to mobile", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            signatureWidth: 500,
            signatureHeight: 100,
            penMinWidth: 5,
            penMaxWidth: 5,
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
  test("Signature scaled", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            signatureWidth: 500,
            signatureHeight: 100,
            penMinWidth: 5,
            penMaxWidth: 5,
            signatureAutoScaleEnabled: true
          },
        ]
      });
      await t.click("canvas", { offsetX: 40, offsetY: 10 });
      await t.click("canvas", { offsetX: 370, offsetY: 60 });
      await t.click("canvas", { offsetX: 700, offsetY: 110 });
      await t.wait(100);
      await takeElementScreenshot("signature-scaled.png", ".sd-question", t, comparer);
      await t.resizeWindow(500, 1080);
      await t.click("canvas", { offsetX: 20, offsetY: 60 });
      await t.click("canvas", { offsetX: 160, offsetY: 35 });
      await t.click("canvas", { offsetX: 300, offsetY: 10 });
      await t.wait(100);
      await takeElementScreenshot("signature-scaled-resize.png", ".sd-question", t, comparer);
      await t.click("button[title=\"Clear\"]");
      await takeElementScreenshot("signature-clear.png", ".sd-question", t, comparer);
    });
  });
  test("Signature update from value", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "600px",
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            signatureWidth: 100,
            signatureHeight: 100,
            penMinWidth: 5,
            penMaxWidth: 5,
            signatureAutoScaleEnabled: true
          },
        ]
      });

      await ClientFunction(() => {
        window["survey"].getQuestionByName("q1").value = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
      })();

      await takeElementScreenshot("signature-data.png", ".sd-question", t, comparer);
    });
  });
  test("Signature loadingIndicator", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "600px",
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            storeDataAsText: false,
          },
        ]
      });
      await ClientFunction(() => {
        window["survey"].getQuestionByName("q1").stateChanged("loading");
      })();
      await ClientFunction(() => {
        (document.querySelector(".sd-loading-indicator .sv-svg-icon") as any).style.animationName = "unset";
      })();

      await takeElementScreenshot("signature-data-loading.png", ".sd-question", t, comparer);
    });
  });
});