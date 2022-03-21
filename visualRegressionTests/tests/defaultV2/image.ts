import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, explicitErrorHandler } from "../../helper";
import { imageSource } from "../../constants";

const title = "Image Screenshot";

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
  test("Check image question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "image",
          name: "image_question",
          imageWidth: "1024px",
          imageHeight: "465px",
          width: "1024px",
          imageLink: imageSource
        },
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question--image");
    await takeScreenshot("image-question.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});