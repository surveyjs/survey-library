import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, checkElementScreenshot } from "../../helper";

const title = "Survey Screenshot";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Check survey title", async (t) => {
    await t.resizeWindow(800, 600);
    await initSurvey(framework, {
      title: "Survey Title",
      widthMode: "responsive",
      questions: [
        {
          type: "text",
          title: "Question title",
          name: "q1"
        }
      ]
    });
    await checkElementScreenshot("survey-title.png", Selector(".sd-title"), t);
    await ClientFunction(() => {
      (<any>window).survey.description = "descr";
    })();
    await checkElementScreenshot("survey-title-descr.png", Selector(".sd-title"), t);
    await checkElementScreenshot("survey-body.png", Selector(".sd-body"), t);
  });
});