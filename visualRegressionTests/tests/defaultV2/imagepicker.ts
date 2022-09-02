import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, explicitErrorHandler, checkElementScreenshot, resetFocusToBody } from "../../helper";
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

  test("Check responsive imagepicker", async (t) => {
    await t.resizeWindow(1920, 1500);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      widthMode: "responsive",
      questions: [
        {
          type: "imagepicker",
          name: "choosepicture",
          title: "Imagepicker",
          choices: [{
            value: "lion",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
          },
          {
            value: "giraffe",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
          },
          {
            value: "panda",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
          },
          {
            value: "camel",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
          },
          ]
        }
      ]
    });
    await resetFocusToBody();
    await t.wait(1000);
    await checkElementScreenshot("imagepicker-responsive-max.png", Selector(".sd-question"), t);
    await t.resizeWindow(700, 1500);
    await checkElementScreenshot("imagepicker-responsive-medium.png", Selector(".sd-question"), t);
    await t.resizeWindow(500, 1500);
    await checkElementScreenshot("imagepicker-responsive-min.png", Selector(".sd-question"), t);
  });
  test("Check image picker responsive, colCount !== 0", async (t) => {
    await t.resizeWindow(1920, 1500);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      widthMode: "responsive",
      questions: [
        {
          type: "imagepicker",
          name: "choosepicture",
          title: "Imagepicker",
          colCount: 3,
          choices: [{
            value: "lion",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
          },
          {
            value: "giraffe",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
          },
          {
            value: "panda",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
          },
          {
            value: "camel",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
          },
          ]
        }
      ]
    });
    await resetFocusToBody();
    await t.wait(1000);
    await checkElementScreenshot("imagepicker-responsive-col-count-3.png", Selector(".sd-question"), t);
    await ClientFunction(() => { (<any>window).survey.getAllQuestions()[0].colCount = 1; })();
    await checkElementScreenshot("imagepicker-responsive-col-count-1.png", Selector(".sd-question"), t);
  });
  test("Check image picker question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      "elements": [
        {
          "type": "imagepicker",
          "name": "question2",
          "choices": [
            {
              "value": "lion",
              "imageLink": imageSource
            },
            "item1"
          ],
          imageWidth: 200,
          imageHeight: 150,
          "imageFit": "cover"
        }
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-imagepicker");
    await takeScreenshot("imagepicker-question.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
