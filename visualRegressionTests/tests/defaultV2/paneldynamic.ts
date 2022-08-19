import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler, wrapVisualTest, takeElementScreenshot } from "../../helper";

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
    await explicitErrorHandler();
    await applyTheme(theme);
    await initSurvey(framework, json);
  });
  test("Paneldynamic progressTop mode", async (t) => {
    await t.resizeWindow(1920, 1080);
    const paneldynamicRoot = Selector(".sd-question--paneldynamic");
    await ClientFunction(() => {
      (window as any).survey.getQuestionByName("applications").currentIndex = 2;
    })();
    await checkElementScreenshot("paneldynamic-progress-top.png", paneldynamicRoot, t);
    await ClientFunction(() => {
      (window as any).survey.getAllQuestions()[0].allowRemovePanel = false;
    })();
    await checkElementScreenshot("paneldynamic-without-remove-button.png", paneldynamicRoot, t);
    await ClientFunction(() => {
      (window as any).survey.getAllQuestions()[0].allowRemovePanel = true;
      (window as any).survey.getQuestionByName("applications").legacyNavigation = true;
    })();
    await checkElementScreenshot("paneldynamic-progress-top-legacy-navigation.png", paneldynamicRoot, t);
    await ClientFunction(() => { (window as any).survey.getQuestionByName("applications").panelCount = 0; })();
    await checkElementScreenshot("paneldynamic-empty.png", paneldynamicRoot, t);
  });
  test("Paneldynamic list mode", async (t) => {
    await t.resizeWindow(1920, 1920);
    const paneldynamicRoot = Selector(".sd-question--paneldynamic");
    await ClientFunction(() => {
      document.body.focus();
      (window as any).survey.getQuestionByName("applications").renderMode = "list";
    })();
    await checkElementScreenshot("paneldynamic-list.png", paneldynamicRoot, t);
  });
});

frameworks.forEach(framework => {
  const json = {
    elements: [
      {
        type: "panel",
        title: "Panel",
        elements: [
          {
            type: "paneldynamic",
            name: "nested_paneldynamic",
            title: "Paneldynamic",
            panelCount: 1,
            templateElements: [{
              name: "q2",
              title: "Text question",
              type: "text"
            }]
          },
          {
            type: "paneldynamic",
            name: "nested_paneldynamic2",
            title: "Paneldynamic",
            startWithNewLine: false,
            panelCount: 1,
            templateElements: [{
              name: "q2",
              title: "Text question",
              type: "text"
            }]
          }
        ]
      }
    ]
  };
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await explicitErrorHandler();
    await applyTheme(theme);
    await initSurvey(framework, json);
  });
  test("Two Paneldynamics in one row", async (t)=>{
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1920);
      await ClientFunction(() => {
        document.body.focus();
      })();
      await takeElementScreenshot("two-paneldynamic-in-one-row", Selector(".sd-panel"), t, comparer);
    });
  });
});
