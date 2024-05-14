import { Selector, ClientFunction } from "testcafe";
import { setData } from "../../../testCafe/helper";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest, resetFocusToBody, resetHoverToBody } from "../../helper";
import { backgroundImage } from "../../constants";

const title = "ReadOnly and Preview";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Radiogroup ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "radiogroup",
            "name": "car",
            "choices": ["Ford", "Vauxhall", "BMW", "Peugeot"],
            "readOnly": true,
            "defaultValue": "BMW",
          },
        ]
      });
      await takeElementScreenshot("readonly-radiogroup.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-radiogroup.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Single Input ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "name": "username",
            "type": "text",
            "defaultValue": "John",
            readOnly: true
          },
        ]
      });
      await takeElementScreenshot("readonly-single-input.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-single-input.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Comment Input ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "name": "username",
            "type": "comment",
            "defaultValue": "text\nto\ntest\ncomment",
            "readOnly": true
          },
        ]
      });
      await takeElementScreenshot("readonly-comment.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-comment.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Multiple text Input ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "multipletext",
            "name": "question1",
            "defaultValue": {
              "text1": "item1",
              "text2": "item2"
            },
            "readOnly": true,
            "items": [
              {
                "name": "text1"
              },
              {
                "name": "text2"
              }
            ]
          },
        ]
      });
      await takeElementScreenshot("readonly-multiple.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-multiple.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Rating ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "rating",
            "name": "nps-score",
            "title": "Rating",
            "rateMin": 1,
            "rateMax": 5,
            "minRateDescription": "Not Satisfied",
            "maxRateDescription": "Completely Satisfied",
            "defaultValue": 4,
            "readOnly": true
          }
        ]
      });
      await takeElementScreenshot("readonly-rating.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-rating.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Rating as dropdown ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "rating",
            "name": "nps-score",
            "title": "Rating",
            "rateMin": 1,
            "rateMax": 5,
            "minRateDescription": "Not Satisfied",
            "maxRateDescription": "Completely Satisfied",
            "defaultValue": 4,
            "readOnly": true,
            "displayMode": "dropdown",
          }
        ]
      });
      await takeElementScreenshot("readonly-rating-dropdown.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-rating-dropdown.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Rating Stars ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "rating",
            "name": "nps-score",
            "title": "Rating",
            "rateType": "stars",
            "rateMin": 1,
            "rateMax": 5,
            "minRateDescription": "Not Satisfied",
            "maxRateDescription": "Completely Satisfied",
            "defaultValue": 4,
            "readOnly": true
          }
        ]
      });
      await takeElementScreenshot("readonly-rating-stars.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-rating-stars.png", Selector(".sd-question__content"), t, comparer);
    });
  });
  test("Rating Smileys ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "rating",
            "name": "nps-score",
            "title": "Rating",
            "rateType": "smileys",
            "rateMin": 1,
            "rateMax": 5,
            "minRateDescription": "Not Satisfied",
            "maxRateDescription": "Completely Satisfied",
            "defaultValue": 4,
            "readOnly": true
          }
        ]
      });
      await takeElementScreenshot("readonly-rating-smileys.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-rating-smileys.png", Selector(".sd-question__content"), t, comparer);
    });
  });
  test("Rating Smileys colored ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "rating",
            "name": "nps-score",
            "title": "Rating",
            "rateType": "smileys",
            "rateMin": 1,
            "rateMax": 5,
            "minRateDescription": "Not Satisfied",
            "maxRateDescription": "Completely Satisfied",
            "defaultValue": 4,
            "readOnly": true,
            "scaleColorMode": "colored",
          }
        ]
      });
      await takeElementScreenshot("readonly-rating-smileys-colored.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-rating-smileys-colored.png", Selector(".sd-question__content"), t, comparer);
    });
  });
  test("Rating Smileys and Stars in matrix ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        "showPreviewBeforeComplete": "showAnsweredQuestions",
        widthMode: "static",
        width: "700px",
        elements: [{
          "type": "matrixdropdown",
          "name": "question1",
          "defaultValue": {
            "Row 1": {
              "Column 1": 3,
              "Column 2": 2
            }
          },
          "readOnly": true,
          "columns": [
            {
              "name": "Column 1",
              "cellType": "rating",
              "rateType": "smileys"
            },
            {
              "name": "Column 2",
              "cellType": "rating",
              "rateType": "stars"
            }
          ],
          "cellType": "rating",
          "rows": [
            "Row 1"
          ]
        }]
      });
      await takeElementScreenshot("readonly-rating-smileys-matrix.png", Selector(".sd-table__cell .sd-rating").nth(0), t, comparer);
      await takeElementScreenshot("readonly-rating-stars-matrix.png", Selector(".sd-table__cell .sd-rating").nth(1), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await t.expect(Selector(".sd-rating__item-smiley--preview").visible).ok();
      await t.expect(Selector(".sd-rating__item-star--preview").visible).ok();
      await takeElementScreenshot("preview-rating-smileys-matrix.png", Selector(".sd-table__cell .sd-rating").nth(0), t, comparer);
      await takeElementScreenshot("preview-rating-stars-matrix.png", Selector(".sd-table__cell .sd-rating").nth(1), t, comparer);
    });
  });
  test("Dropdown ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "dropdown",
            "name": "question1",
            "defaultValue": "Item 2",
            "readOnly": true,
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
        ]
      });
      await takeElementScreenshot("readonly-dropdown.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-dropdown.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Tagbox ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "tagbox",
            "name": "question2",
            "defaultValue": [
              "Item 2",
              "Item 3"
            ],
            "readOnly": true,
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
        ]
      });
      await takeElementScreenshot("readonly-tagbox.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-tagbox.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Checkbox Group ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "checkbox",
            "name": "car",
            "choices": ["Ford", "Vauxhall", "BMW", "Peugeot"],
            "readOnly": true,
            "defaultValue": ["Ford", "BMW"],
          },
        ]
      });
      await takeElementScreenshot("readonly-checkbox.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-checkbox.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Signature ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "signaturepad",
            "name": "question1",
            "readOnly": true,
          },
        ]
      });
      await takeElementScreenshot("readonly-signature.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-signature.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Panel Dynamic ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 1000);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "question1",
                "readOnly": true,
                "templateElements": [
                  {
                    "type": "text",
                    "name": "question2"
                  }
                ],
                "renderMode": "progressTop"
              },
              {
                "type": "paneldynamic",
                "name": "question3",
                "defaultValue": [
                  {
                    "question2": "123",
                    "question4": "123"
                  }
                ],
                "readOnly": true,
                "templateElements": [
                  {
                    "type": "text",
                    "name": "question4"
                  }
                ],
                "renderMode": "progressTop"
              },
              {
                "type": "paneldynamic",
                "name": "question5",
                "defaultValue": [
                  {
                    "question2": "123",
                    "question6": "123"
                  },
                  {
                    "question2": "567",
                    "question6": "456"
                  }
                ],
                "readOnly": true,
                "templateElements": [
                  {
                    "type": "text",
                    "name": "question6"
                  }
                ],
                "renderMode": "progressTop"
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "showPreviewBeforeComplete": "showAllQuestions"
      });
      await takeElementScreenshot("readonly-panel-dynamic-no-entries.png", Selector(".sd-question--paneldynamic").nth(0), t, comparer);
      await takeElementScreenshot("readonly-panel-dynamic-one-entry.png", Selector(".sd-question--paneldynamic").nth(1), t, comparer);
      await takeElementScreenshot("readonly-panel-dynamic-two-entries.png", Selector(".sd-question--paneldynamic").nth(2), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-panel-dynamic-no-entries.png", Selector(".sd-question--paneldynamic").nth(0), t, comparer);
      await takeElementScreenshot("preview-panel-dynamic-one-entry.png", Selector(".sd-question--paneldynamic").nth(1), t, comparer);
      await takeElementScreenshot("preview-panel-dynamic-two-entries.png", Selector(".sd-question--paneldynamic").nth(2), t, comparer);
    });
  });

  test("Ranking ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "ranking",
            "name": "car",
            "choices": ["Ford", "Vauxhall", "BMW", "Peugeot"],
            "readOnly": true,
            "defaultValue": ["BMW", "Ford", "Vauxhall", "Peugeot"]
          },
        ]
      });
      await takeElementScreenshot("readonly-ranking.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-ranking.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Boolean ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "boolean",
            "name": "boolean1",
            "valueTrue": "Yes",
            "valueFalse": "No",
            "readOnly": true,
            "defaultValue": "Yes",
          }
        ]
      });
      await takeElementScreenshot("readonly-boolean.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-boolean.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Boolean:Indeterminate ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "boolean",
            "name": "boolean1",
            "valueTrue": "Yes",
            "valueFalse": "No",
            "readOnly": true,
          }
        ]
      });
      await takeElementScreenshot("readonly-boolean-indeterminate.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-boolean-indeterminate.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Boolean:Radio ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "boolean",
            "name": "boolean1",
            "valueTrue": "Yes",
            "valueFalse": "No",
            "renderAs": "radio",
            "readOnly": true,
            "defaultValue": "Yes",
          }
        ]
      });
      await takeElementScreenshot("readonly-boolean-radio.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-boolean-radio.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Boolean:Checkbox ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "boolean",
            "name": "boolean2",
            "valueTrue": "Yes",
            "valueFalse": "No",
            "renderAs": "checkbox",
            "label": "I am 21 or older",
            "titleLocation": "hidden",
            "readOnly": true,
            "defaultValue": "Yes",
          }
        ]
      });

      await takeElementScreenshot("readonly-boolean-checkbox.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-boolean-checkbox.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("ImagePicker ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "imagepicker",
            "name": "animals",
            "titleLocation": "hidden",
            "choices": [
              {
                "value": "lion",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
                "text": "Lion"
              },
              {
                "value": "giraffe",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
                "text": "Giraffe"
              }
            ],
            "readOnly": true,
            "defaultValue": "lion"
          }
        ]
      });

      await takeElementScreenshot("readonly-imagepicker.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-imagepicker.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Matrix ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "matrix",
            "name": "question1",
            "readOnly": true,
            "defaultValue": {
              "Row 1": "Column 1",
              "Row 2": "Column 2"
            },
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
      });

      await takeElementScreenshot("readonly-matrix-single.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-matrix-single.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Matrix ReadOnly and Preview alt rows", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "matrix",
            "name": "question1",
            "readOnly": true,
            "alternateRows": true,
            "defaultValue": {
              "Row 1": "Column 1",
              "Row 2": "Column 2"
            },
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
      });

      await takeElementScreenshot("readonly-matrix-single-alt-rows.png", Selector(".sd-question"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-matrix-single-alt-rows.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("File ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "file",
            "titleLocation": "hidden",
            "name": "files",
            "storeDataAsText": false,
            "waitForUpload": true,
            "allowMultiple": true,
            "maxSize": 102400,
            "hideNumber": true,
            "readOnly": true,
            defaultValue: [
              {
                "name": "File.png",
                "type": "image/png",
                "content": "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              }
            ],
          }
        ]
      });

      await takeElementScreenshot("readonly-file.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-file.png", Selector(".sd-question__content"), t, comparer);
    });
  });

});
