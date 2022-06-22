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

  test("Matrix many columns", async (t) => {
    await t.resizeWindow(800, 600);
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
    const questionRoot = Selector(".sd-row");
    await checkElementScreenshot("question-matrix-dropdown-columns.png", questionRoot, t);
  });

  test("Matrix row top align", async (t) => {
    await t.resizeWindow(800, 600);
    await initSurvey(framework, {
      "logoPosition": "right",
      "focusFirstQuestionAutomatic": false,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrix",
              "name": "question1",
              "verticalAlign": "top",
              "columns": [
                "Column 1",
                "Column 2",
                "Column 3"
              ],
              "rows": [
                {
                  "value": "Row 1",
                  "text": "Row with many words that is long and long and long"
                },
                "Row 2"
              ]
            }
          ]
        }
      ]
    });
    //await t.click(Selector("body"), { offsetX: 5, offsetY: 5 });
    const questionRoot = Selector(".sd-row");
    await checkElementScreenshot("question-matrix-top-align.png", questionRoot, t);
  });

  test("Matrix alternate rows", async (t) => {
    await t.resizeWindow(800, 600);
    await initSurvey(framework, {
      "logoPosition": "right",
      "focusFirstQuestionAutomatic": false,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrix",
              "name": "question1",
              "alternateRows": true,
              "columns": [
                "Column 1",
                "Column 2",
                "Column 3"
              ],
              "rows": [
                {
                  "value": "Row 1",
                  "text": "Row with many words that is long and long and long"
                },
                "Row 2",
                "Row 3"
              ]
            }
          ]
        }
      ]
    });
    //await t.click(Selector("body"), { offsetX: 5, offsetY: 5 });
    const questionRoot = Selector(".sd-row");
    await checkElementScreenshot("question-matrix-alternate-rows.png", questionRoot, t);
  });

  test("Matrix dropdown row top align", async (t) => {
    await t.resizeWindow(800, 600);
    await initSurvey(framework, {
      "logoPosition": "right",
      "focusFirstQuestionAutomatic": false,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrixdropdown",
              "name": "question1",
              "verticalAlign": "top",
              "columns": [
                {
                  "name": "Column 1"
                },
                {
                  "name": "Column 2"
                },
                {
                  "name": "Column 3"
                }
              ],
              "choices": [
                1,
                2,
                3,
                4,
                5
              ],
              "rows": [
                {
                  "value": "Row 1",
                  "text": "Row with many words that is long and long and long"
                },
                "Row 2"
              ]
            }
          ]
        }
      ]
    });
    //await t.click(Selector("body"), { offsetX: 5, offsetY: 5 });
    const questionRoot = Selector(".sd-row");
    await checkElementScreenshot("question-matrix-dropdown-top-align.png", questionRoot, t);
  });

});