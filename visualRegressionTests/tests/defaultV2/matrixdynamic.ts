import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test } from "../../helper";

const title = "Paneldynamic Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Matrixdynamic empty placeholder", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdynamic",
          name: "frameworks",
          title: "Please tells us your opinion about JavaScript MVVM frameworks.",
          hideColumnsIfEmpty: true,
          emptyRowsText: "There is no records yet.\nClick the button below to add a new record.",
          addRowText: "Add New Record",
          rowCount: 0
        }
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const matrixdynamicRoot = Selector(".sd-question");
    await takeScreenshot("matrixdynamic-empty.png", matrixdynamicRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check Matrixdynamic", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdynamic",
          name: "frameworks",
          title: "Please tells us your opinion about JavaScript MVVM frameworks.",
          columns: [
            {
              "name": "Column 1",
              "title": "Framework"
            },
            {
              "name": "Column 2",
              "title": "How long do you use it?"
            },
            {
              "name": "Column 3",
              "title": "What is main strength?"
            }
          ],
          addRowText: "Add a New Record",
          rowCount: 3
        },
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const matrixdynamicRoot = Selector(".sd-question");
    await ClientFunction(()=>{ document.body.focus(); })();
    await takeScreenshot("matrixdynamic.png", matrixdynamicRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check Matrixdynamic vertical", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdynamic",
          name: "Current Level of Function",
          columnLayout: "vertical",
          rowCount: 3,
          columns: [
            {
              name: "Date",
              title: "Date",
              cellType: "text",
              inputType: "date"
            }, {
              name: "AmbDistance",
              title: "Amb Distance",
              cellType: "text"
            }, {
              name: "Amb Assistance",
              cellType: "dropdown",
              choices: ["D", "MAX", "MOD", "MIN"]
            }, {
              name: "Standing Tolerance",
              cellType: "text"
            }, {
              name: "UE Strength",
              cellType: "text"
            }, {
              name: "Cognitive Function",
              cellType: "comment"
            }
          ],
          choices: [1],
          cellType: "comment",
          addRowText: "Add Date +",
          removeRowText: "Remove",
          width: "800px"
        }
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const matrixdynamicRoot = Selector(".sd-question");
    await ClientFunction(()=>{ document.body.focus(); })();
    await takeScreenshot("matrixdynamic-vertical.png", matrixdynamicRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check Matrixdynamic with scrollbar", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdynamic",
          name: "frameworks",
          title: "Please tells us your opinion about JavaScript MVVM frameworks.",
          columns: [
            {
              "name": "Column 1",
              "title": "Framework"
            },
            {
              "name": "Column 2",
              "title": "How long do you use it?"
            },
            {
              "name": "Column 3",
              "title": "What is main strength?"
            },
            {
              "name": "Column 4",
              "title": "What is main purpose?"
            },
            {
              "name": "Column 5",
              "title": "How often do you use it?"
            },
          ],
          addRowText: "Add a New Record",
          rowCount: 3,
          columnMinWidth: "180px",
          width: "704px"
        },
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const matrixdynamicRoot = Selector(".sd-question");
    await ClientFunction(()=>{ document.body.focus(); })();
    await t
      .scroll(matrixdynamicRoot, "center");
    await takeScreenshot("matrixdynamic-scroll.png", matrixdynamicRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});