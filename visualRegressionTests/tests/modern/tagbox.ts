import { Selector, ClientFunction, t } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest, resetFocusToBody } from "../../helper";

const title = "Tagbox Screenshot (modern)";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "modern";

frameworks.forEach(async framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Check tagbox with multiple rows", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "elements": [
          {
            "type": "tagbox",
            "name": "q1",
            "defaultValue": ["Math: Practical Math", "Math: Developmental Algebra", "Math: Algebra", "Science: Chemistry", "Social Sciences: U.S. and Global Economics", "World Languages: French", "World Languages: German", "World Languages: Latin"],
            "choices": ["English: American Literature", "English: British and World Literature", "Math: Consumer Math", "Math: Practical Math", "Math: Developmental Algebra", "Math: Continuing Algebra", "Math: Pre-Algebra", "Math: Algebra", "Math: Geometry", "Math: Integrated Mathematics", "Science: Physical Science", "Science: Earth Science", "Science: Biology", "Science: Chemistry", "History: World History", "History: Modern World Studies", "History: U.S. History", "History: Modern U.S. History", "Social Sciences: U.S. Government and Politics", "Social Sciences: U.S. and Global Economics", "World Languages: Spanish", "World Languages: French", "World Languages: German", "World Languages: Latin", "World Languages: Chinese", "World Languages: Japanese"]
          }
        ]
      });
      await resetFocusToBody();
      await takeElementScreenshot("tagbox-question-multiple-rows-modern.png", Selector(".sv-tagbox"), t, comparer);
    });
  });
});