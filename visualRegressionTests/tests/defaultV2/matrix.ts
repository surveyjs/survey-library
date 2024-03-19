import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, resetFocusToBody, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Matrixdynamic Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`.page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });

  test("Matrix single-select", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                  {
                    "value": "Column 1",
                    "text": "Title"
                  },
                  {
                    "value": "Column 2",
                    "text": "Title"
                  },
                  {
                    "value": "Column 3",
                    "text": "Title"
                  }
                ],
                "rows": [
                  {
                    "value": "Row 1",
                    "text": "Title"
                  },
                  {
                    "value": "Row 2",
                    "text": "Title"
                  },
                  {
                    "value": "Row 3",
                    "text": "Title"
                  }
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-single-select-alt-rows.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").showHeader = false; })();
      await takeElementScreenshot("question-matrix-single-select-alt-rows-no-header.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").alternateRows = false; })();
      await takeElementScreenshot("question-matrix-single-select-no-header.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").showHeader = true; })();
      await takeElementScreenshot("question-matrix-single-select.png", questionRoot, t, comparer);
    });
  });

  test("Matrix single-select in panel", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                      {
                        "value": "Column 1",
                        "text": "Title"
                      },
                      {
                        "value": "Column 2",
                        "text": "Title"
                      },
                      {
                        "value": "Column 3",
                        "text": "Title"
                      },
                      {
                        "value": "Column 4",
                        "text": "Title"
                      },
                      {
                        "value": "Column 5",
                        "text": "Title"
                      }
                    ],
                    "rows": [
                      {
                        "value": "Row 1",
                        "text": "Title"
                      },
                      {
                        "value": "Row 2",
                        "text": "Title"
                      },
                      {
                        "value": "Row 3",
                        "text": "Title"
                      }
                    ]
                  },
                  {
                    "type": "matrix",
                    "name": "q2",
                    "title": "Question",
                    "alternateRows": true,
                    "columns": [
                      {
                        "value": "Column 1",
                        "text": "Title"
                      },
                      {
                        "value": "Column 2",
                        "text": "Title"
                      },
                      {
                        "value": "Column 3",
                        "text": "Title"
                      },
                      {
                        "value": "Column 4",
                        "text": "Title"
                      },
                      {
                        "value": "Column 5",
                        "text": "Title"
                      }
                    ],
                    "rows": [
                      {
                        "value": "Row 1",
                        "text": "Title"
                      },
                      {
                        "value": "Row 2",
                        "text": "Title"
                      },
                      {
                        "value": "Row 3",
                        "text": "Title"
                      }
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-single-select-in-panel.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getAllQuestions().map(q => q.showHeader = false); })();
      await takeElementScreenshot("question-matrix-single-select-in-panel-no-header.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getAllQuestions().map(q => q.titleLocation = "hidden"); })();
      await takeElementScreenshot("question-matrix-single-select-in-panel-no-header-no-title.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getAllQuestions().map(q => q.showHeader = true); })();
      await takeElementScreenshot("question-matrix-single-select-in-panel-no-title.png", questionRoot, t, comparer);
    });
  });
  test("Matrix single-select in panel with many columns", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework,
        {
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
                      columns: [
                        "Column 1",
                        "Column 2",
                        "Column 3",
                        "Column 4",
                        "Column 5",
                        "Column 6",
                        "Column 7",
                        "Column 8",
                        "Column 9",
                        "Column 10",
                        "Column 11",
                        "Column 12",
                        "Column 13",
                        "Column 14"
                      ],
                      rows: ["Row 1", "Row 2"]
                    }
                  ]
                }
              ]
            }
          ]
        });

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-single-select-in-panel-many-columns.png", questionRoot, t, comparer);
    });
  });

  test("Matrix multi-select in panel", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                      {
                        "name": "Column 1",
                        "title": "Title"
                      },
                      {
                        "name": "Column 2",
                        "title": "Title"
                      },
                      {
                        "name": "Column 3",
                        "title": "Title"
                      },
                      {
                        "name": "Column 4",
                        "title": "Title"
                      },
                      {
                        "name": "Column 5",
                        "title": "Title"
                      }
                    ],
                    "rows": [
                      {
                        "value": "Row 1",
                        "text": "Title"
                      },
                      {
                        "value": "Row 2",
                        "text": "Title"
                      },
                      {
                        "value": "Row 3",
                        "text": "Title"
                      }
                    ]
                  },
                  {
                    "type": "matrixdropdown",
                    "name": "q2",
                    "title": "Question",
                    "cellType": "text",
                    "columns": [
                      {
                        "name": "Column 1",
                        "title": "Title"
                      },
                      {
                        "name": "Column 2",
                        "title": "Title"
                      },
                      {
                        "name": "Column 3",
                        "title": "Title"
                      },
                      {
                        "name": "Column 4",
                        "title": "Title"
                      },
                      {
                        "name": "Column 5",
                        "title": "Title"
                      }
                    ],
                    "rows": [
                      {
                        "value": "Row 1",
                        "text": "Title"
                      },
                      {
                        "value": "Row 2",
                        "text": "Title"
                      },
                      {
                        "value": "Row 3",
                        "text": "Title"
                      }
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-multi-select-in-panel.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getAllQuestions().map(q => q.showHeader = false); })();
      await takeElementScreenshot("question-matrix-multi-select-in-panel-no-header.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getAllQuestions().map(q => q.titleLocation = "hidden"); })();
      await takeElementScreenshot("question-matrix-multi-select-in-panel-no-header-no-title.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getAllQuestions().map(q => q.showHeader = true); })();
      await takeElementScreenshot("question-matrix-multi-select-in-panel-no-title.png", questionRoot, t, comparer);
    });
  });

  test("Matrix multi-select", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                  {
                    "name": "Column 1",
                    "title": "Title"
                  },
                  {
                    "name": "Column 2",
                    "title": "Title"
                  },
                  {
                    "name": "Column 3",
                    "title": "Title"
                  }
                ],
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
                "cellType": "text",
                "rows": [
                  {
                    "value": "Row 1",
                    "text": "Title"
                  },
                  {
                    "value": "Row 2",
                    "text": "Title"
                  },
                  {
                    "value": "Row 3",
                    "text": "Title"
                  }
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-multi-select.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").showHeader = false; })();
      await takeElementScreenshot("question-matrix-multi-select-no-header.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").titleLocation = "hidden"; })();
      await takeElementScreenshot("question-matrix-multi-select-no-header-no-title.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").showHeader = true; })();
      await takeElementScreenshot("question-matrix-multi-select-no-title.png", questionRoot, t, comparer);
    });
  });

  test("Matrix multi-select column width", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                  {
                    "name": "Column 1",
                    "title": "Title",
                    "width": "100px"
                  },
                  {
                    "name": "Column 2",
                    "title": "Title"
                  },
                  {
                    "name": "Column 3",
                    "title": "Title"
                  }
                ],
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
                "cellType": "text",
                "rows": [
                  {
                    "value": "Row 1",
                    "text": "Title"
                  },
                  {
                    "value": "Row 2",
                    "text": "Title"
                  },
                  {
                    "value": "Row 3",
                    "text": "Title"
                  }
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-multi-select-col-width.png", questionRoot, t, comparer);
    });
  });

  test("Matrix dynamic", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                  {
                    "name": "Column 1",
                    "title": "Title"
                  },
                  {
                    "name": "Column 2",
                    "title": "Title"
                  },
                  {
                    "name": "Column 3",
                    "title": "Title"
                  }
                ],
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-dynamic.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").showHeader = false; })();
      await takeElementScreenshot("question-matrix-dynamic-no-header.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").titleLocation = "hidden"; })();
      await takeElementScreenshot("question-matrix-dynamic-no-header-no-title.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").showHeader = true; })();
      await takeElementScreenshot("question-matrix-dynamic-no-title.png", questionRoot, t, comparer);
    });
  });

  test("Matrix dynamic detail", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                  {
                    "name": "Column 1",
                    "title": "Title"
                  },
                  {
                    "name": "Column 2",
                    "title": "Title"
                  },
                  {
                    "name": "Column 3",
                    "title": "Title"
                  }
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
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-dynamic-detail.png", questionRoot, t, comparer);
      await t.click(Selector(".sd-table__cell--detail-button").filterVisible().nth(1));

      await takeElementScreenshot("question-matrix-dynamic-detail-expanded.png", questionRoot, t, comparer);

    });
  });

  test("Matrix dropdown detail", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1200, 1200);
      await initSurvey(framework, {
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
                  {
                    "name": "Column 1",
                    "title": "Title"
                  },
                  {
                    "name": "Column 2",
                    "title": "Title"
                  },
                  {
                    "name": "Column 3",
                    "title": "Title"
                  }
                ],
                "rows": [
                  "Row 1", "Row 2", "Row 3"
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
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
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

      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("question-matrix-dropdown-detail.png", questionRoot, t, comparer);
      await t.click(Selector(".sd-table__cell--detail-button").filterVisible().nth(1));

      await takeElementScreenshot("question-matrix-dropdown-detail-expanded.png", questionRoot, t, comparer);

      await ClientFunction(() => { window["survey"].getQuestionByName("q").showHeader = false; })();
      await takeElementScreenshot("question-matrix-dropdown-detail-no-header-expanded.png", questionRoot, t, comparer);

      await t.click(Selector(".sd-table__cell--detail-button").filterVisible().nth(1));
      await t.click(questionRoot, { offsetX: 1, offsetY: 1 });

      await takeElementScreenshot("question-matrix-dropdown-detail-no-header.png", questionRoot, t, comparer);
    });
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
            minWidth: "800px",
            maxWidth: "800px",
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

      await t
        .click(Selector("body"), { offsetX: 5, offsetY: 5 });
      await t.pressKey("tab");
      await takeElementScreenshot("question-matrix-detail-focus.png", questionRoot, t, comparer);
    });
  });

  test("Matrix detail questions in one row", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
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
      await t
        .click(Selector("#show-detail").nth(0))
        .click(Selector("body"), { offsetX: 5, offsetY: 5 });

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("question-matrix-detail-one-row.png", questionRoot, t, comparer);
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

      await ClientFunction(() => {
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
        focusFirstQuestionAutomatic: true,
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
  test("Matrix with checkboxes", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
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
            "rows": [
              {
                "value": "col",
                "text": "Col"
              }
            ]
          }
        ],
        "widthMode": "static",
        "width": "700"
      });
      const questionRoot = Selector(".sd-table");
      await takeElementScreenshot("question-matrix-with-checkboxes.png", questionRoot, t, comparer);
    });
  });

  test("Matrix rubric alternate rows", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
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
                "columns": [
                  "Column 1",
                  "Column 2"
                ],
                "rows": [
                  "Row 1",
                  "Row 2"
                ],
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
      //await t.click(Selector("body"), { offsetX: 5, offsetY: 5 });
      const rowElement = Selector(".sd-row");

      await takeElementScreenshot("question-matrix-rubric-alternate-rows.png", rowElement, t, comparer);
    });
  });

  test("Matrix in single page mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrix",
                "name": "question1",
                "titleLocation": "hidden",
                "columns": [
                  "Column 1",
                  "Column 2",
                  "Column 3"
                ],
                "rows": [
                  "Row 1",
                  "Row 2"
                ]
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
                "columns": [
                  "Column 1",
                  "Column 2",
                  "Column 3"
                ],
                "rows": [
                  "Row 1",
                  "Row 2"
                ]
              }
            ]
          }
        ],
        "questionsOnPageMode": "singlePage",
        "focusFirstQuestionAutomatic": false,
        "widthMode": "static"
      });
      //await t.click(Selector("body"), { offsetX: 5, offsetY: 5 });
      const pageElement = Selector(".sd-page");

      await takeElementScreenshot("question-matrix--single-page.png", pageElement, t, comparer);
    });
  });
  test("Check mobile multi select matrix with showHeader: false", async (t) => {
    await t.resizeWindow(600, 1080);
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
        elements: [
          {
            "type": "matrixdropdown",
            "name": "q1",
            "title": "Question",
            "showHeader": false,
            "cellType": "text",
            "columns": [
              {
                "name": "Column 1",
                "title": "Title"
              },
              {
                "name": "Column 2",
                "title": "Title"
              },
              {
                "name": "Column 3",
                "title": "Title"
              },
              {
                "name": "Column 4",
                "title": "Title"
              },
              {
                "name": "Column 5",
                "title": "Title"
              }
            ],
            "rows": [
              {
                "value": "Row 1",
                "text": "Title"
              },
              {
                "value": "Row 2",
                "text": "Title"
              },
            ]
          }
        ]
      });
      await takeElementScreenshot("responsiveness-matrixdropdown-without-header.png", Selector(".sd-question"), t, comparer);
    });
  });
});

