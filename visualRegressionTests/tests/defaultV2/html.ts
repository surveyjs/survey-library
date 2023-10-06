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
  test("Check html question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "html",
            name: "html_question",
            html: "<b>Hello, world!</b><p>Hello, world!</p><b>Hello, world!</b>",
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px"
          },
        ]
      });
      const questionRoot = Selector(".sd-question--html");
      await t.wait(1000);
      await takeElementScreenshot("html-question.png", questionRoot, t, comparer);
    });
  });

  test("Check html question wrapping", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "html",
            name: "html_question",
            html: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px"
          },
        ]
      });
      const questionRoot = Selector(".sd-question--html");
      await t.wait(1000);
      await takeElementScreenshot("html-question-wrapping.png", questionRoot, t, comparer);
    });
  });
});