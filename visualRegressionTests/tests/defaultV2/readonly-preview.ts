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

});
