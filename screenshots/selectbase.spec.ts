import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, test } from "../e2e/helper";

const title = "Selectbase Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check checkbox question", async ({ page }) => {
      // Skip initSurvey and wrapVisualTest parts
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        elements: [
          {
            type: "checkbox",
            title: "Which cities have you visited?",
            name: "checkbox_question",
            choices: ["Moscow", "Paris", "Madrid", "Munich", "London", "None"],
            colCount: 1
          },
        ]
      });

      // Wait for question to be visible
      const question = page.locator(".sd-question");
      await question.waitFor();

      // Take screenshots for different colCount values
      await compareScreenshot(page, question, "checkbox-col-count-1.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("checkbox_question").colCount = 2;
      });
      await compareScreenshot(page, question, "checkbox-col-count-2.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("checkbox_question").colCount = 0;
      });
      await compareScreenshot(page, question, "checkbox-col-count-0.png");
    });

    test("Check checkbox state", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        elements: [
          {
            type: "checkbox",
            title: "Which cities have you visited?",
            name: "checkbox_question",
            choices: ["Moscow", "Paris", "Madrid"],
            colCount: 1
          },
        ]
      });

      const question = page.locator(".sd-question");
      await question.waitFor();

      await page.locator(".sd-item__control-label").filter({ hasText: "Moscow" }).click();
      await page.locator(".sd-item__control-label").filter({ hasText: "Paris" }).click();
      await page.locator(".sd-item__control-label").filter({ hasText: "Madrid" }).hover();

      await compareScreenshot(page, question, "checkbox-state.png");

      await page.locator(".sd-selectbase__item").filter({ hasText: "Madrid" }).hover({ position: { x: 1, y: 1 } });
      await compareScreenshot(page, question, "checkbox-state-hover-near.png");
    });

    test("Check radiogroup question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        elements: [
          {
            "type": "radiogroup",
            "name": "car",
            "title": "What car are you driving?",
            "showNoneItem": true,
            "colCount": 0,
            "choices": [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          }
        ]
      });

      const question = page.locator(".sd-question");
      await question.waitFor();

      await compareScreenshot(page, question, "radiogroup-col-count-0.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("car").colCount = 4;
      });
      await compareScreenshot(page, question, "radiogroup-col-count-4.png");

      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].showClearButton = true;
      });
      await compareScreenshot(page, question, "radiogroup-clear-button.png");
    });

    test("Check radiogroup state", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        elements: [
          {
            type: "radiogroup",
            title: "Which city have you visited?",
            name: "radiogroup_question",
            choices: ["Moscow", "Paris", "Madrid"],
            colCount: 1
          },
        ]
      });

      const question = page.locator(".sd-question");
      await question.waitFor();

      await page.locator(".sd-item__control-label").filter({ hasText: "Moscow" }).click();
      await page.locator(".sd-item__control-label").filter({ hasText: "Madrid" }).hover();

      await compareScreenshot(page, question, "radiogroup-state.png");

      await resetFocusToBody(page);
      await page.locator(".sd-selectbase__item").filter({ hasText: "Madrid" }).hover({ position: { x: 1, y: 1 } });
      await compareScreenshot(page, question, "radiogroup-state-hover-near.png");
    });

    test("Check checkbox with comment long area", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "checkbox",
                "choices": [
                  "choice1"
                ],
                "hasComment": true,
                "name": "q1",
                "commentText": "Please feel free to share your thoughts in the comment box down below"
              }
            ]
          }
        ],
        "widthMode": "static",
        "width": "600px"
      });

      const question = page.locator(".sd-question");
      await question.waitFor();

      await resetFocusToBody(page);
      await compareScreenshot(page, question, "checkbox-with-long-comment-text.png");
    });

    test("Check rating smileys scale colored question themes", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "radiogroup",
                "name": "question1",
                "startWithNewLine": false,
                "title": "question1",
                "choices": [
                  "option1",
                  "option2",
                  "option3"
                ],
                "colCount": 3
              }
            ],
            "title": "Personal Information"
          }
        ]
      });

      const questionRoot = page.locator(".sd-question .sd-question__content");
      await questionRoot.waitFor();

      await page.evaluate(() => {
        const themeJson = {
          "themeName": "default",
          "colorPalette": "light",
          "isPanelless": true,
          "cssVariables": {
            "--sjs-corner-radius": "4px",
            "--sjs-base-unit": "8px",
            "--sjs-shadow-small": "0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-shadow-inner": "inset 0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-border-default": "rgba(0, 0, 0, 0.16)",
            "--sjs-border-light": "rgba(0, 0, 0, 0.09)",
            "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
            "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
            "--sjs-general-backcolor-dim-light": "rgba(249, 249, 249, 1)",
            "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
            "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
            "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
            "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",
            "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
            "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
            "--sjs-shadow-inner-reset": "inset 0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
            "--sjs-general-backcolor-dim": "rgba(255, 255, 255, 1)",
            "--sjs-primary-backcolor": "rgba(25, 179, 148, 1)",
            "--sjs-primary-backcolor-dark": "rgba(20, 164, 139, 1)",
            "--sjs-primary-backcolor-light": "rgba(25, 179, 148, 0.1)",
            "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
            "--sjs-special-red": "rgba(229, 10, 62, 1)",
            "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)"
          },
        };
        (window as any).survey.applyTheme(themeJson);
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "question-selectbase-zero-column-panelless.png");
    });

    test("check selectbase with item comment", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "checkbox",
                "name": "question1",
                "choices": [
                  {
                    "value": "Item 1",
                    "showCommentArea": true
                  },
                  {
                    "value": "Item 2",
                    "showCommentArea": true
                  },
                  {
                    "value": "Item 3",
                    "showCommentArea": true
                  },
                  "Item 4",
                  "Item 5",
                  "Item 6",
                  "Item 7"
                ],
                "colCount": 5,
              }
            ]
          }
        ],
        "headerView": "advanced"
      });
      await page.evaluate(() => {
        (window as any).survey.data = {
          "question1": [
            {
              "value": "Item 1",
              "comment": "aaaa"
            },
            {
              "value": "Item 3",
              "comment": "bbbb"
            },
            {
              "value": "Item 2",
              "comment": "cccc"
            }
          ]
        };
      });
      const questionRoot = page.locator(".sd-question .sd-question__content");
      await questionRoot.waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "question-selectbase-item-comment.png");
    });
  });
});