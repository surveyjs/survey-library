import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, setOptions, url_test, takeElementScreenshot, wrapVisualTest, resetFocusToBody } from "../../helper";

const title = "Expression Screenshot";

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

  test("Check expression question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            "type": "expression",
            "name": "q1",
            "title": "Question1",
            "titleLocation": "left",
            "expression": "123"
          },
          {
            "type": "expression",
            "name": "q2",
            "title": "Question2",
            "expression": "123"
          },
        ],
        "focusFirstQuestionAutomatic": true
      });
      await takeElementScreenshot("expression-title-left.png", Selector(".sd-question[data-name=q1]"), t, comparer);
      await takeElementScreenshot("expression-title-top.png", Selector(".sd-question[data-name=q2]"), t, comparer);
    });
  });

});

