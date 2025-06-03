import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Matrixdynamic Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Matrix single-select", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "q",
                "title": "Question",
                "alternateRows": true,
                "columns": [
                  { "value": "Column 1", "text": "Title" },
                  { "value": "Column 2", "text": "Title" },
                  { "value": "Column 3", "text": "Title" }
                ],
                "rows": [
                  { "value": "Row 1", "text": "Title" },
                  { "value": "Row 2", "text": "Title" },
                  { "value": "Row 3", "text": "Title" }
                ]
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "720px",
        focusFirstQuestionAutomatic: false
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-alt-rows.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").showHeader = false; });
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-alt-rows-no-header.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").alternateRows = false; });
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-no-header.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").showHeader = true; });
      await compareScreenshot(page, questionRoot, "question-matrix-single-select.png");
    });

    test("Matrix checkboxes", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "focusFirstQuestionAutomatic": true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdropdown",
                "name": "question1",
                "defaultValue": {
                  "Row 1": {
                    "Column 1": [1]
                  },
                  "Row 2": {
                    "Column 1": [1]
                  }
                },
                "alternateRows": true,
                "columns": [
                  {
                    "name": "Column 1",
                    "cellType": "checkbox",
                    "showInMultipleColumns": true
                  }
                ],
                "choices": [1, 2],
                "rows": ["Row 1", "Row 2"]
              }
            ]
          }
        ],
        "widthMode": "static"
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-checkboxes-alt-rows-focused.png");
    });

    test("Matrix single-select in panel", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        focusFirstQuestionAutomatic: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "matrix",
                    "name": "q1",
                    "title": "Question",
                    "alternateRows": true,
                    "columns": [
                      { "value": "Column 1", "text": "Title" },
                      { "value": "Column 2", "text": "Title" },
                      { "value": "Column 3", "text": "Title" },
                      { "value": "Column 4", "text": "Title" },
                      { "value": "Column 5", "text": "Title" }
                    ],
                    "rows": [
                      { "value": "Row 1", "text": "Title" },
                      { "value": "Row 2", "text": "Title" },
                      { "value": "Row 3", "text": "Title" }
                    ]
                  },
                  {
                    "type": "matrix",
                    "name": "q2",
                    "title": "Question",
                    "alternateRows": true,
                    "columns": [
                      { "value": "Column 1", "text": "Title" },
                      { "value": "Column 2", "text": "Title" },
                      { "value": "Column 3", "text": "Title" },
                      { "value": "Column 4", "text": "Title" },
                      { "value": "Column 5", "text": "Title" }
                    ],
                    "rows": [
                      { "value": "Row 1", "text": "Title" },
                      { "value": "Row 2", "text": "Title" },
                      { "value": "Row 3", "text": "Title" }
                    ]
                  }
                ],
                "title": "Question"
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "1136"
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-in-panel.png");

      await page.evaluate(() => { window["survey"].getAllQuestions().map(q => q.showHeader = false); });
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-in-panel-no-header.png");

      await page.evaluate(() => { window["survey"].getAllQuestions().map(q => q.titleLocation = "hidden"); });
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-in-panel-no-header-no-title.png");

      await page.evaluate(() => { window["survey"].getAllQuestions().map(q => q.showHeader = true); });
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-in-panel-no-title.png");
    });

    test("Matrix single-select in panel with many columns", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework,
        {
          showQuestionNumbers: "on",
          pages: [
            {
              name: "page1",
              elements: [
                {
                  type: "panel",
                  name: "panel1",
                  title: "Panel",
                  elements: [
                    {
                      type: "matrix",
                      name: "question2",
                      columns: ["Column 1", "Column 2", "Column 3", "Column 4", "Column 5", "Column 6", "Column 7", "Column 8", "Column 9", "Column 10", "Column 11", "Column 12", "Column 13", "Column 14"], rows: ["Row 1", "Row 2"]
                    }
                  ]
                }
              ]
            }
          ]
        });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-single-select-in-panel-many-columns.png");
    });

    test("Matrix multi-select in panel", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        focusFirstQuestionAutomatic: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "matrixdropdown",
                    "name": "q1",
                    "title": "Question",
                    "cellType": "text",
                    "columns": [
                      { "name": "Column 1", "title": "Title" },
                      { "name": "Column 2", "title": "Title" },
                      { "name": "Column 3", "title": "Title" },
                      { "name": "Column 4", "title": "Title" },
                      { "name": "Column 5", "title": "Title" }
                    ],
                    "rows": [
                      { "value": "Row 1", "text": "Title" },
                      { "value": "Row 2", "text": "Title" },
                      { "value": "Row 3", "text": "Title" }
                    ]
                  },
                  {
                    "type": "matrixdropdown",
                    "name": "q2",
                    "title": "Question",
                    "cellType": "text",
                    "columns": [
                      { "name": "Column 1", "title": "Title" },
                      { "name": "Column 2", "title": "Title" },
                      { "name": "Column 3", "title": "Title" },
                      { "name": "Column 4", "title": "Title" },
                      { "name": "Column 5", "title": "Title" }
                    ],
                    "rows": [
                      { "value": "Row 1", "text": "Title" },
                      { "value": "Row 2", "text": "Title" },
                      { "value": "Row 3", "text": "Title" }
                    ]
                  }
                ],
                "title": "Question"
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "1136"
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-in-panel.png");

      await page.evaluate(() => { window["survey"].getAllQuestions().map(q => q.showHeader = false); });
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-in-panel-no-header.png");

      await page.evaluate(() => { window["survey"].getAllQuestions().map(q => q.titleLocation = "hidden"); });
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-in-panel-no-header-no-title.png");

      await page.evaluate(() => { window["survey"].getAllQuestions().map(q => q.showHeader = true); });
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-in-panel-no-title.png");
    });

    test("Matrix multi-select", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdropdown",
                "name": "q",
                "title": "Question",
                "columns": [
                  { "name": "Column 1", "title": "Title" },
                  { "name": "Column 2", "title": "Title" },
                  { "name": "Column 3", "title": "Title" }
                ],
                "choices": [1, 2, 3, 4, 5],
                "cellType": "text",
                "rows": [
                  { "value": "Row 1", "text": "Title" },
                  { "value": "Row 2", "text": "Title" },
                  { "value": "Row 3", "text": "Title" }
                ]
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "720px",
        focusFirstQuestionAutomatic: false
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").showHeader = false; });
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-no-header.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").titleLocation = "hidden"; });
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-no-header-no-title.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").showHeader = true; });
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-no-title.png");
    });

    test("Matrix multi-select column width", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdropdown",
                "name": "q",
                "title": "Question",
                "columns": [
                  { "name": "Column 1", "title": "Title", "width": "100px" },
                  { "name": "Column 2", "title": "Title" },
                  { "name": "Column 3", "title": "Title"
                  }
                ],
                "choices": [1, 2, 3, 4, 5],
                "cellType": "text",
                "rows": [
                  { "value": "Row 1", "text": "Title" },
                  { "value": "Row 2", "text": "Title" },
                  { "value": "Row 3", "text": "Title" }
                ]
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "720px",
        focusFirstQuestionAutomatic: false
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-multi-select-col-width.png");
    });

    test("Matrix dynamic", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "q",
                "title": "Question",
                "columns": [
                  { "name": "Column 1", "title": "Title" },
                  { "name": "Column 2", "title": "Title" },
                  { "name": "Column 3", "title": "Title" }
                ],
                "choices": [1, 2, 3, 4, 5],
                "cellType": "text",
                "rowCount": 3
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "720px",
        focusFirstQuestionAutomatic: false
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-dynamic.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").showHeader = false; });
      await compareScreenshot(page, questionRoot, "question-matrix-dynamic-no-header.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").titleLocation = "hidden"; });
      await compareScreenshot(page, questionRoot, "question-matrix-dynamic-no-header-no-title.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").showHeader = true; });
      await compareScreenshot(page, questionRoot, "question-matrix-dynamic-no-title.png");
    });

    test("Matrix dynamic detail", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "q",
                "title": "Question",
                "columns": [
                  { "name": "Column 1", "title": "Title" },
                  { "name": "Column 2", "title": "Title" },
                  { "name": "Column 3", "title": "Title" }
                ],
                "detailElements": [
                  {
                    "type": "text",
                    "name": "question1",
                    "titleLocation": "hidden"
                  },
                  {
                    "type": "text",
                    "name": "question2",
                    "titleLocation": "hidden"
                  },
                  {
                    "type": "text",
                    "name": "question3",
                    "titleLocation": "hidden"
                  }
                ],
                "detailPanelMode": "underRow",
                "choices": [1, 2, 3, 4, 5],
                "cellType": "text",
                "rowCount": 3
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "720px",
        focusFirstQuestionAutomatic: false
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-dynamic-detail.png");

      await page.click(".sd-table__cell--detail-button >> nth=1");
      await compareScreenshot(page, questionRoot, "question-matrix-dynamic-detail-expanded.png");
    });

    test("Matrix dropdown detail", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1200 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdropdown",
                "name": "q",
                "title": "Question",
                "columns": [
                  { "name": "Column 1", "title": "Title" },
                  { "name": "Column 2", "title": "Title" },
                  { "name": "Column 3", "title": "Title" }
                ],
                "rows": ["Row 1", "Row 2", "Row 3"],
                "detailElements": [
                  {
                    "type": "text",
                    "name": "question1",
                    "titleLocation": "hidden"
                  },
                  {
                    "type": "text",
                    "name": "question2",
                    "titleLocation": "hidden"
                  },
                  {
                    "type": "text",
                    "name": "question3",
                    "titleLocation": "hidden"
                  }
                ],
                "detailPanelMode": "underRow",
                "choices": [1, 2, 3, 4, 5],
                "cellType": "text"
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "728px",
        focusFirstQuestionAutomatic: false
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-dropdown-detail.png");

      await page.click(".sd-table__cell--detail-button >> nth=1");
      await compareScreenshot(page, questionRoot, "question-matrix-dropdown-detail-expanded.png");

      await page.evaluate(() => { window["survey"].getQuestionByName("q").showHeader = false; });
      await compareScreenshot(page, questionRoot, "question-matrix-dropdown-detail-no-header-expanded.png");

      await page.click(".sd-table__cell--detail-button >> nth=1");
      await page.click(".sd-row", { position: { x: 1, y: 1 } });
      await compareScreenshot(page, questionRoot, "question-matrix-dropdown-detail-no-header.png");
    });

    test("Matrix dropdown", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "focusFirstQuestionAutomatic": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdropdown",
                "name": "question1",
                "columns": [
                  { "name": "Column 1" },
                  { "name": "Column 2" },
                  { "name": "Column 3" }
                ],
                "choices": [1, 2, 3, 4, 5],
                "rows": ["Row 1", "Row 2"]
              }
            ]
          }
        ]
      });

      await page.click(".sd-dropdown");
      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-dropdown.png");
    });

    test("Matrix detail row", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        elements: [
          {
            type: "matrixdynamic",
            name: "matrix",
            rowCount: 2,
            detailPanelMode: "underRow",
            columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
            detailElements: [{ type: "text", name: "q1" }],
            minWidth: "800px",
            maxWidth: "800px",
            width: "800px"
          },
        ],
      });

      await page.click("#show-detail >> nth=0");
      await page.click("body", { position: { x: 5, y: 5 } });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "question-matrix-detail.png");

      await page.hover(".sd-table__cell--detail-button");
      await compareScreenshot(page, questionRoot, "question-matrix-detail-hover.png");

      await page.click("body", { position: { x: 5, y: 5 } });
      await page.keyboard.press("Tab");
      await compareScreenshot(page, questionRoot, "question-matrix-detail-focus.png");
    });

    test("Matrix detail questions in one row", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        elements: [
          {
            type: "matrixdynamic",
            name: "matrix",
            rowCount: 2,
            detailPanelMode: "underRow",
            columns: [{ name: "col1" }],
            detailElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", startWithNewLine: false }],
            minWidth: "800px",
            maxWidth: "800px",
            width: "800px"
          },
        ],
      });

      await page.click("#show-detail >> nth=0");
      await page.click("body", { position: { x: 5, y: 5 } });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "question-matrix-detail-one-row.png");
    });

    test("Matrix many columns", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
                  { "name": "col1" },
                  { "name": "col2" },
                  { "name": "col3" },
                  { "name": "col5" },
                  { "name": "col6" },
                  { "name": "col6" },
                  { "name": "col7" },
                  { "name": "col8" },
                  { "name": "col9" },
                  { "name": "col10" },
                  { "name": "col11" },
                  { "name": "col12" }
                ],
                "rows": ["item1", "item2"]
              }
            ]
          }
        ]
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-dropdown-columns.png");
    });

    test("Matrix row top align", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
                "columns": ["Column 1", "Column 2", "Column 3"],
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

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-top-align.png");
    });

    test("Matrix alternate rows", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "focusFirstQuestionAutomatic": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "question1",
                "isRequired": true,
                "alternateRows": true,
                "columns": ["Column 1", "Column 2", "Column 3"],
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

      const rowElement = page.locator(".sd-row");
      await compareScreenshot(page, rowElement, "question-matrix-alternate-rows.png");

      await page.click(".sd-navigation__complete-btn");
      await page.click("body", { position: { x: 0, y: 0 } });
      await compareScreenshot(page, rowElement, "question-matrix-alternate-rows-invalid-value.png");

      await page.locator("tr").filter({ hasText: "Row with many words that is" }).locator("span").nth(1).click();
      await compareScreenshot(page, rowElement, "question-matrix-alternate-rows-selected-focused.png");

      await page.click("body", { position: { x: 0, y: 0 } });
      await compareScreenshot(page, rowElement, "question-matrix-alternate-rows-selected-value.png");
    });

    test("Matrix dropdown row top align", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
                  { "name": "Column 1" },
                  { "name": "Column 2" },
                  { "name": "Column 3" }
                ],
                "choices": [1, 2, 3, 4, 5],
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

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-dropdown-top-align.png");
    });

    test("Matrix fonts", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "question1",
                "columns": ["Column 1", "Column 2", "Column 3"],
                "rows": [
                  {
                    "value": "Row 1",
                    "text": "АБВГД"
                  },
                  "Row 2"
                ]
              }
            ]
          }
        ]
      });

      const questionRoot = page.locator(".sv-string-viewer").filter({ hasText: "АБВГД" });
      await compareScreenshot(page, questionRoot, "question-matrix-non-latin.png");
    });

    test("Matrix columns and row width", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "focusFirstQuestionAutomatic": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "matrix",
                "rowTitleWidth": "300px",
                "columnMinWidth": "30px",
                "columns": ["col1", "col2"],
                "rows": ["item1", "item2"]
              }
            ]
          }
        ]
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-columns-rows-width.png");
    });

    test("Matrix with description under input", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "focusFirstQuestionAutomatic": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "matrix",
                "description": "matrix-description",
                "descriptionLocation": "underInput",
                "columns": ["col1", "col2"],
                "rows": ["item1", "item2"]
              }
            ]
          }
        ]
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "question-matrix-description-under-input.png");
    });

    test("Matrix with boolean column", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "question1",
            "columns": [
              { "name": "Column 1" },
              {
                "name": "Column 3",
                "title": "Column 2",
                "cellType": "boolean"
              }
            ],
            "rows": ["Row 1", "Row 2"]
          }
        ],
        "widthMode": "static",
        "width": "1000"
      });

      const questionRoot = page.locator(".sd-table");
      await compareScreenshot(page, questionRoot, "question-matrix-with-boolean-column.png");
    });

    test("Matrix with checkboxes", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "question",
            "columns": [
              {
                "name": "strengths",
                "title": "Row caption",
                "cellType": "checkbox",
                "colCount": 1,
                "choices": [
                  "Long item title",
                  "Item",
                  "Medium item"
                ]
              }
            ],
            "columnLayout": "vertical",
            "rows": [{ "value": "col", "text": "Col" }]
          }
        ],
        "widthMode": "static",
        "width": "700"
      });

      const questionRoot = page.locator(".sd-table");
      await compareScreenshot(page, questionRoot, "question-matrix-with-checkboxes.png");
    });

    test("Matrix rubric alternate rows", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "planningPerformance",
                "title": "Question",
                "hideNumber": true,
                "defaultValue": {
                  "Row 1": "Column 1",
                  "Row 2": "Column 2"
                },
                "alternateRows": true,
                "columns": ["Column 1", "Column 2"],
                "rows": ["Row 1", "Row 2"],
                "cells": {
                  "Row 1": {
                    "Column 1": "Abc",
                    "Column 2": "Cde"
                  },
                  "Row 2": {
                    "Column 1": "Fgh",
                    "Column 2": "Igk"
                  }
                }
              }
            ]
          }
        ],
        "widthMode": "static"
      });

      const rowElement = page.locator(".sd-row");
      await compareScreenshot(page, rowElement, "question-matrix-rubric-alternate-rows.png");
    });

    test("Matrix in single page mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "question1",
                "titleLocation": "hidden",
                "columns": ["Column 1", "Column 2", "Column 3"],
                "rows": ["Row 1", "Row 2"]
              }
            ]
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "matrix",
                "name": "question2",
                "titleLocation": "hidden",
                "columns": ["Column 1", "Column 2", "Column 3"],
                "rows": ["Row 1", "Row 2"]
              }
            ]
          }
        ],
        "questionsOnPageMode": "singlePage",
        "focusFirstQuestionAutomatic": false,
        "widthMode": "static"
      });

      const pageElement = page.locator(".sd-page");
      await compareScreenshot(page, pageElement, "question-matrix--single-page.png");
    });

    test("Matrix title location left", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "Journeys",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "question2",
                "title": "Please enter some information",
                "titleLocation": "left",
                "columns": [
                  { "name": "Column 2", "cellType": "text" },
                  { "name": "Column 3", "cellType": "radiogroup" }
                ],
                "choices": [1, 2, 3, 4, 5],
                "rowCount": 0
              }
            ]
          }
        ],
        "showQuestionNumbers": "off"
      });

      const pageElement = page.locator(".sd-page");
      await compareScreenshot(page, pageElement, "question-matrix--title-left.png");
    });

    test("Check mobile multi select matrix with showHeader: false", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        elements: [
          {
            "type": "matrixdropdown",
            "name": "q1",
            "title": "Question",
            "showHeader": false,
            "cellType": "text",
            "columns": [
              { "name": "Column 1", "title": "Title" },
              { "name": "Column 2", "title": "Title" },
              { "name": "Column 3", "title": "Title" },
              { "name": "Column 4", "title": "Title" },
              { "name": "Column 5", "title": "Title" }
            ],
            "rows": [
              { "value": "Row 1", "text": "Title" },
              { "value": "Row 2", "text": "Title" },
            ]
          }
        ]
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "responsiveness-matrixdropdown-without-header.png");
    });

    test("matrix focus frame in one line", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "matrixdropdown",
                    "name": "question1",
                    "titleLocation": "hidden",
                    "showHeader": false,
                    "columns": [
                      { "name": "Column 1", "width": "60%" }
                    ],
                    "choices": [1, 2, 3, 4, 5],
                    "cellType": "text",
                    "rows": [
                      { "value": "Row 1", "text": "Name:" },
                      { "value": "Row 2", "text": "Email address:" },
                      { "value": "Row 3", "text": "Phone:" }
                    ]
                  },
                  {
                    "type": "matrixdropdown",
                    "name": "question2",
                    "startWithNewLine": false,
                    "titleLocation": "hidden",
                    "columnMinWidth": "60%",
                    "showHeader": false,
                    "columns": [
                      { "name": "Column 1", "width": "60%" }
                    ],
                    "choices": [1, 2, 3, 4, 5],
                    "cellType": "text",
                    "rows": [
                      { "value": "Row 1", "text": "Department:" },
                      { "value": "Row 2", "text": "Role:" },
                      { "value": "Row 3", "text": "Location:" }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "cookieName": "1000",
        "widthMode": "static",
        "width": "1000",
        "focusFirstQuestionAutomatic": true
      });

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "matrix-focus-frame-in-one-line.png");
    });
  });
});