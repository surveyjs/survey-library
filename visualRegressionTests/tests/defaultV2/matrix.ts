import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, explicitErrorHandler, resetFocusToBody, wrapVisualTest, takeElementScreenshot } from "../../helper";

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
  test("Matrix dropdown", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
                  "Row 1",
                  "Row 2"
                ]
              }
            ]
          }
        ]
      });
      await t.click(".sd-dropdown");

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-dropdown.png", questionRoot, t, comparer);
    });
  });

  test("Matrix detail row", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("question-matrix-detail.png", questionRoot, t, comparer);

      await t.hover(Selector(".sd-table__cell--detail-button"));
      await takeElementScreenshot("question-matrix-detail-hover.png", questionRoot, t, comparer);
    });
  });

  test("Matrix many columns", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("question-matrix-dropdown-columns.png", questionRoot, t, comparer);
    });
  });

  test("Matrix row top align", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("question-matrix-top-align.png", questionRoot, t, comparer);
    });
  });

  test("Matrix alternate rows", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
                "isRequired": true,
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
      const rowElement = Selector(".sd-row");

      await takeElementScreenshot("question-matrix-alternate-rows.png", rowElement, t, comparer);

      await t.click(Selector(".sd-navigation__complete-btn"));
      await resetFocusToBody();
      await takeElementScreenshot("question-matrix-alternate-rows-invalid-value.png", rowElement, t, comparer);

      await ClientFunction(()=>{
        (window as any).survey.getAllQuestions()[0].value = { "Row 1": "Column 1" };
        document.body.focus();
      })();

      await takeElementScreenshot("question-matrix-alternate-rows-selected-value.png", rowElement, t, comparer);
    });
  });

  test("Matrix dropdown row top align", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("question-matrix-dropdown-top-align.png", questionRoot, t, comparer);
    });
  });

  test("Matrix fonts", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "question1",
                "columns": [
                  "Column 1",
                  "Column 2",
                  "Column 3"
                ],
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

      await takeElementScreenshot("question-matrix-non-latin.png", Selector(".sv-string-viewer").withText("АБВГД"), t, comparer);
    });
  });

  test("Matrix columns and row width", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
                "name": "matrix",
                "rowTitleWidth": "300px",
                "columnMinWidth": "30px",
                "columns": ["col1", "col2"],
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
      await takeElementScreenshot("question-matrix-columns-rows-width.png", questionRoot, t, comparer);
    });
  });
  test("Matrix with description under input", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
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
                "rows": [
                  "item1",
                  "item2"
                ]
              }
            ]
          }
        ]
      });
      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-description-under-input.png", questionRoot, t, comparer);
    });
  });

  test("Matrix with boolean column", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "question1",
            "columns": [
              {
                "name": "Column 1"
              },
              {
                "name": "Column 3",
                "title": "Column 2",
                "cellType": "boolean"
              }
            ],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ],
        "widthMode": "static",
        "width": "1000"
      });
      const questionRoot = Selector(".sd-table");
      await takeElementScreenshot("question-matrix-with-boolean-column.png", questionRoot, t, comparer);
    });
  });

});
