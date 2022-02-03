import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test } from "../../helper";

const title = "Paneldynamic Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

var json = {
  showQuestionNumbers: "off",
  questions: [
    {
      type: "paneldynamic",
      name: "applications",
      title: "What application do you use?",
      renderMode: "progressTop",
      templateTitle: "{panel.application}",
      templateElements: [
        {
          name: "application",
          type: "dropdown",
          title: "Application",
          defaultValue: "Adobe Photoshop",
          choices: [
            "Adobe Photoshop",
          ],
        },
        {
          name: "often",
          type: "radiogroup",
          title: "How often do you use this applications?",
          choices: ["Rare", "Sometimes", "Always"]
        }
      ],
      panelCount: 2,
      noEntriesText: "You can add as many applications as you want.\nJust click the button below to start.",
      panelAddText: "Add application",
      panelRemoveText: "Remove application",
      width: "768px"
    },
  ]
};

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await applyTheme(theme);
    await initSurvey(framework, json);
  });
  test("Paneldynamic progressTop mode", async (t) => {
    await t.resizeWindow(1920, 1080);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const paneldynamicRoot = Selector(".sd-question--paneldynamic");
    await ClientFunction(() => { (window as any).survey.getQuestionByName("applications").currentIndex = 2; })();
    await takeScreenshot("paneldynamic-progress-top.png", paneldynamicRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
    await ClientFunction(() => { (window as any).survey.getQuestionByName("applications").panelCount = 0; })();
    await takeScreenshot("paneldynamic-empty.png", paneldynamicRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
