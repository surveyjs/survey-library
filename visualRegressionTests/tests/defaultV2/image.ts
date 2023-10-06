import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, wrapVisualTest, takeElementScreenshot } from "../../helper";
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
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check image question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        widthMode: "responsive",
        questions: [
          {
            type: "image",
            name: "image_question",
            imageWidth: "1024px",
            imageHeight: "465px",
            minWidth: "1024px",
            maxWidth: "1024px",
            width: "1024px",
            imageLink: imageSource
          },
        ]
      });
      const questionRoot = Selector(".sd-question--image");
      await takeElementScreenshot("image-question.png", questionRoot, t, comparer);
    });
  });
  test("Check image in-row question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        questions: [
          {
            type: "image",
            name: "image_question",
            imageWidth: "200px",
            imageHeight: "100px",
            imageLink: imageSource
          },
          {
            type: "image",
            name: "image_question",
            imageWidth: "200px",
            imageHeight: "100px",
            imageLink: imageSource,
            startWithNewLine: false
          },
        ]
      });
      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("image-question-row.png", questionRoot, t, comparer);
    });
  });
  test("Check image loading is broken", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        questions: [
          {
            "type": "image",
            "name": "noimage",
            "imageLink": "https://surveyjs.io/Cos/image-picker/panda.jpg"
          }
        ]
      });
      const questionRoot = Selector(".sd-question--image");
      await takeElementScreenshot("image-not-load.png", questionRoot, t, comparer);
    });
  });
});