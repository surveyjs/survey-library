import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler } from "../../helper";

const title = "Selectbase Screenshot";

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
          isResponsive: true,
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
    await ClientFunction(() => { document.body.focus(); })();
    await t.wait(1000);
    await checkElementScreenshot("imagepicker-responsive-max.png", Selector(".sd-question"), t);
    await t.resizeWindow(700, 1500);
    await checkElementScreenshot("imagepicker-responsive-medium.png", Selector(".sd-question"), t);
    await t.resizeWindow(500, 1500);
    await checkElementScreenshot("imagepicker-responsive-min.png", Selector(".sd-question"), t);
  });
});
