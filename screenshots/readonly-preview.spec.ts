import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "ReadOnly and Preview";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Radiogroup ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-radiogroup.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-radiogroup.png");
    });

    test("Single Input ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "name": "username",
            "type": "text",
            "defaultValue": "John",
            "readOnly": true
          },
        ]
      });

      await compareScreenshot(page, ".sd-question__content", "readonly-single-input.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-single-input.png");
    });

    test("Comment Input ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-comment.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-comment.png");
    });

    test("Multiple text Input ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
              { "name": "text1" },
              { "name": "text2" }
            ]
          },
        ]
      });

      await compareScreenshot(page, ".sd-question__content", "readonly-multiple.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-multiple.png");
    });

    test("Rating ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-rating.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-rating.png");
    });

    test("Rating as dropdown ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-rating-dropdown.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-rating-dropdown.png");
    });

    test("Rating Stars ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-rating-stars.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-rating-stars.png");
    });

    test("Rating Smileys ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-rating-smileys.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-rating-smileys.png");
    });

    test("Rating Smileys colored ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-rating-smileys-colored.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-rating-smileys-colored.png");
    });

    test("Rating Smileys and Stars in matrix ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
          "rows": ["Row 1"]
        }]
      });

      await compareScreenshot(page, page.locator(".sd-table__cell .sd-rating").nth(0), "readonly-rating-smileys-matrix.png");
      await compareScreenshot(page, page.locator(".sd-table__cell .sd-rating").nth(1), "readonly-rating-stars-matrix.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await expect(page.locator(".sd-rating__item-smiley--preview").first()).toBeVisible();
      await expect(page.locator(".sd-rating__item-star--preview").first()).toBeVisible();
      await compareScreenshot(page, page.locator(".sd-table__cell .sd-rating").nth(0), "preview-rating-smileys-matrix.png");
      await compareScreenshot(page, page.locator(".sd-table__cell .sd-rating").nth(1), "preview-rating-stars-matrix.png");
    });

    test("Dropdown ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "dropdown",
            "name": "question1",
            "defaultValue": "Item 2",
            "readOnly": true,
            "choices": ["Item 1", "Item 2", "Item 3"]
          },
        ]
      });

      await compareScreenshot(page, ".sd-question__content", "readonly-dropdown.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-dropdown.png");
    });

    test("Tagbox ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "tagbox",
            "name": "question2",
            "defaultValue": ["Item 2", "Item 3"],
            "readOnly": true,
            "choices": ["Item 1", "Item 2", "Item 3"]
          },
        ]
      });

      await compareScreenshot(page, ".sd-question__content", "readonly-tagbox.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-tagbox.png");
    });

    test("Checkbox Group ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-checkbox.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-checkbox.png");
    });

    test("Signature ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-signature.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-signature.png");
    });

    test("Panel Dynamic ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 1000 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, page.locator(".sd-question--paneldynamic").nth(0), "readonly-panel-dynamic-no-entries.png");
      await compareScreenshot(page, page.locator(".sd-question--paneldynamic").nth(1), "readonly-panel-dynamic-one-entry.png");
      await compareScreenshot(page, page.locator(".sd-question--paneldynamic").nth(2), "readonly-panel-dynamic-two-entries.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, page.locator(".sd-question--paneldynamic").nth(0), "preview-panel-dynamic-no-entries.png");
      await compareScreenshot(page, page.locator(".sd-question--paneldynamic").nth(1), "preview-panel-dynamic-one-entry.png");
      await compareScreenshot(page, page.locator(".sd-question--paneldynamic").nth(2), "preview-panel-dynamic-two-entries.png");
    });

    test("Ranking ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question__content", "readonly-ranking.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-ranking.png");
    });

    test("Boolean ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question__content", "readonly-boolean.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-boolean.png");
    });

    test("Boolean:Indeterminate ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-boolean-indeterminate.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-boolean-indeterminate.png");
    });

    test("Boolean:Radio ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question__content", "readonly-boolean-radio.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-boolean-radio.png");
    });

    test("Boolean:Checkbox ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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

      await compareScreenshot(page, ".sd-question__content", "readonly-boolean-checkbox.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-boolean-checkbox.png");
    });

    test("ImagePicker ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
      await page.waitForLoadState("networkidle");
      await compareScreenshot(page, ".sd-question__content", "readonly-imagepicker.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-imagepicker.png");
    });

    test("Matrix ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
            "columns": ["Column 1", "Column 2", "Column 3"],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      });
      await compareScreenshot(page, ".sd-question__content", "readonly-matrix-single.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-matrix-single.png");
    });

    test("Matrix ReadOnly and Preview alt rows", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
            "columns": ["Column 1", "Column 2", "Column 3"],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      });
      await compareScreenshot(page, ".sd-question", "readonly-matrix-single-alt-rows.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question", "preview-matrix-single-alt-rows.png");
    });

    test("File ReadOnly and Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question__content", "readonly-file.png");
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-question__content", "preview-file.png");
    });

    test("Numbered page Preview", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        "title": "Test",
        "pages": [
          {
            "name": "page1",
            "title": "Page 1 Test",
            "elements": [
              {
                "type": "text",
                "name": "question1",
                "title": "TestQuestion"
              }
            ]
          }
        ],
        "showPageNumbers": true,
        "showPreviewBeforeComplete": true,
        "headerView": "advanced"
      });

      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, ".sd-panel--as-page", "preview-numbered-page.png");
    });

    test("Readonly and Focus", async ({ page }) => {
      const json = {
        elements: [
          { type: "radiogroup", name: "q1", choices: ["Yes", "No"], defaultValue: "No" },
        ],
        readOnly: true
      };

      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await page.locator("div").filter({ hasText: /^Yes$/ }).click();
      await compareScreenshot(page, ".sd-question__content", "readonly-and-focus-unselect-item-not-focused.png");
    });
  });
});