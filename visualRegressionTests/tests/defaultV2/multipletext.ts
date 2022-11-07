import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, explicitErrorHandler, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Multipletext Screenshot";

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
  test("Check multipletext question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "multipletext",
            name: "q1",
            width: "768px",
            title: "Personal Information",
            items: [
              {
                name: "item1",
                title: "Full Name"
              },
              {
                name: "item2",
                title: "Email Address"
              },
              {
                name: "item3",
                title: "ID"
              },
            ]
          },
        ]
      });

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("mutlipletext.png", questionRoot, t, comparer);
    });
  });
});