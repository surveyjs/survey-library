import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler } from "../../helper";

const title = "Matrixdynamic Screenshot";

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
  test("Matrix detail row", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
          width: "800px"
        },
      ],
    });
    await t
      .click(Selector("#show-detail").nth(0))
      .click(Selector("body"), { offsetX: 5, offsetY: 5 });

    const questionRoot = Selector(".sd-question");
    await checkElementScreenshot("question-matrix-detail.png", questionRoot, t);
  });

  test("Matrix manu columns", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      "logoPosition": "right",
      "focusFirstQuestionAutomatic": false,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrixdropdown",
              "name": "matrix",
              "width": "800px",
              "minWidth": "800px",
              "maxWidth": "800px",
              "columns": [
                {
                  "name": "col1"
                },
                {
                  "name": "col2"
                },
                {
                  "name": "col3"
                },
                {
                  "name": "col5"
                },
                {
                  "name": "col6"
                },
                {
                  "name": "col6"
                },
                {
                  "name": "col7"
                },
                {
                  "name": "col8"
                },
                {
                  "name": "col9"
                },
                {
                  "name": "col10"
                },
                {
                  "name": "col11"
                },
                {
                  "name": "col12"
                }
              ],
              "rows": [
                "item1",
                "item2"
              ]
            }
          ]
        }
      ]
    });
    //await t.click(Selector("body"), { offsetX: 5, offsetY: 5 });

    const questionRoot = Selector(".sd-question");
    await checkElementScreenshot("question-matrix-dropdown-columns.png", questionRoot, t);
  });

});