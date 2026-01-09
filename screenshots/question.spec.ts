import { test, expect } from "@playwright/test";
import { QuestionText } from "../e2e/questionHelper";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, setRowItemFlowDirection } from "../e2e/helper";

const title = "Question Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check question without title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "text",
            titleLocation: "hidden",
            name: "question",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
          },
        ]
      });
      const questionRoot = page.locator(".sd-question");
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "question-without-title.png");
    });

    test("Check question with empty title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "text",
            title: " ",
            name: "question",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
          },
        ]
      });
      const questionRoot = page.locator(".sd-question");
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "question-empty-title.png");
    });

    test("Check question num", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        width: "900px",
        elements: [
          {
            type: "text",
            name: "question_with_num",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "question-with-num.png");
    });

    test("Check question color", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        width: "900px",
        elements: [
          {
            type: "text",
            inputType: "color",
            name: "question_color",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            title: "Color question"
          },
        ]
      });
      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "question-color.png");
    });

    test("Check question num + expand/collapse", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "text",
            name: "question_with_num",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            state: "collapsed",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      const questionRoot = page.locator(".sd-question");

      await compareScreenshot(page, questionRoot, "question-collapse.png");
      await page.hover(".sd-element__header");
      await compareScreenshot(page, questionRoot, "question-collapse-hover-focus.png");
      await page.hover("body");
      await page.evaluate(() => { (window as any).survey.rootElement.getRootNode().querySelector(".sd-question__title")?.focus(); });
      await compareScreenshot(page, questionRoot, "question-collapse-hover-focus.png");
      await questionRoot.click();
      await compareScreenshot(page, questionRoot, "question-expand.png");
    });

    test("Check invisible question when showInvisibleElements: true", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "text",
            name: "q1",
            title: "Rate the importance of this scenario for your enterprise (assuming you've encountered it in the past).",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            choices: ["High", "Medium", "Low"],
            visible: false,
          },
        ]
      });
      const questionRoot = page.locator(".sd-question");
      await page.evaluate(() => { (window as any).survey.showInvisibleElements = true; });
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "question-invisible.png");
    });

    test("Check question title actions", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        width: "900px",
        showQuestionNumbers: false,
        elements: [
          {
            type: "text",
            name: "question_with_num",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            state: "collapsed",
            title: "Personal information"
          },
        ]
      };

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions.push({ title: "Reset to Default", action: () => { } });
        });
        window["survey"].fromJSON(json);
      }, json);

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "question-title-actions.png");
    });

    test("Check required question with multiline title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        width: "900px",
        showQuestionNumbers: false,
        elements: [
          {
            type: "text",
            name: "required_question",
            isRequired: true,
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      const questionRoot = page.locator(".sd-question");
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "question-required.png");
    });

    test("Check questions in one row", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "text",
            name: "question_with_num",
            title: "Personal information"
          },
          {
            type: "text",
            name: "question_with_num",
            startWithNewLine: false,
            title: "Contact information"
          },
        ]
      });
      const rowSelector = page.locator(".sd-row");
      await resetFocusToBody(page);
      await compareScreenshot(page, rowSelector, "multiple-row.png");

      await page.evaluate(() => {
        window["survey"].questionTitleLocation = "bottom";
        window["survey"].render();
      });
      await compareScreenshot(page, rowSelector, "multiple-row-title-bottom.png");

      await page.evaluate(() => {
        window["survey"].questionTitleLocation = "left";
        window["survey"].render();
      });
      await compareScreenshot(page, rowSelector, "multiple-row-title-left.png");
    });

    test("Check questions in one row with different default heights", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              { "type": "text", "name": "question3" },
              {
                "type": "checkbox",
                "name": "question4",
                "startWithNewLine": false,
                "choices": ["Item 1", "Item 2", "Item 3"]
              },
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  { "type": "text", "name": "question2" }
                ],
                "title": "Panel"
              },
              {
                "type": "checkbox",
                "name": "question1",
                "startWithNewLine": false,
                "choices": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"] }
            ]
          }
        ],
        "widthMode": "static",
        "width": "1000px"
      });
      const rowSelector = page.locator(".sd-page");
      await resetFocusToBody(page);
      await compareScreenshot(page, rowSelector, "multiple-row-heights.png");
    });

    test("Check questions in one row (overflow content)", async ({ page }) => {
      await page.setViewportSize({ width: 900, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "text",
            name: "question_with_num",
            title: "Personal information"
          },
          {
            type: "text",
            name: "question_with_num",
            startWithNewLine: false,
            title: "Contact information"
          },
          {
            type: "text",
            name: "question_with_num",
            startWithNewLine: false,
            title: "Other information"
          },
        ]
      });
      const rowSelector = page.locator(".sd-row");
      await resetFocusToBody(page);
      await compareScreenshot(page, rowSelector, "multiple-row-overflow.png");
    });

    test("Check question error", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: true,
        elements: [
          {
            type: "text",
            name: "q_error",
            title: "What is your name?",
            isRequired: true,
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onValidateQuestion.add((_, options) => {
          if (options.errors.length === 0) {
            options.error = "Very very very very very very very very very very very very very very very Very very very very very very very very very very very very very very very long error";
          }
        });
        window["survey"].fromJSON(json);
      }, json);

      const qRoot = page.locator(".sd-question");
      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, qRoot, "question-with-error.png");

      await page.setViewportSize({ width: 600, height: 1080 });
      await compareScreenshot(page, qRoot, "responsiveness-question-with-error.png");

      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      await page.fill(".sd-input", "some-text");
      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, qRoot, "question-with-long-error.png");
    });

    test("Check scrollable error", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            "type": "matrixdropdown",
            "name": "question1",
            "isRequired": true,
            "columns": [
              { "name": "Column 1" },
              { "name": "Column 2" },
              { "name": "Column 3" },
              { "name": "Column 4" },
              { "name": "Column 5" },
              { "name": "Column 6" },
              { "name": "Column 7" },
              { "name": "Column 8" },
              { "name": "Column 9" },
              { "name": "Column 10" },
              { "name": "Column 11" },
              { "name": "Column 12" },
              { "name": "Column 13" },
              { "name": "Column 14" },
              { "name": "Column 15" },
              { "name": "Column 16" },
              { "name": "Column 17" },
              { "name": "Column 18" },
              { "name": "Column 19" },
              { "name": "Column 20" },
              { "name": "Column 21" },
              { "name": "Column 22" },
              { "name": "Column 23" },
              { "name": "Column 24" }
            ],
            "cellType": "text",
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      });

      const qRoot = page.locator(".sd-question");
      await page.hover(".sd-navigation__complete-btn");
      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await page.locator(".sd-table__cell").filter({ hasText: "Column 24" }).scrollIntoViewIfNeeded();
      await compareScreenshot(page, qRoot, "question-scrollable-with-error.png");
    });

    test("Check question error with title location left", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "text",
            name: "q_error",
            titleLocation: "left",
            title: "What is your name?",
            isRequired: true,
          }
        ]
      });
      const qRoot = page.locator(".sd-question");
      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, qRoot, "question-with-title-left-and-error.png");
    });

    test("Check question errors bottom", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "text",
            name: "q_error",
            title: "What is your name?",
            isRequired: true,
          }
        ],
        questionErrorLocation: "bottom"
      });
      const qRoot = page.locator(".sd-question");
      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, qRoot, "question-with-error-below.png");

      await page.setViewportSize({ width: 600, height: 1080 });
      await compareScreenshot(page, qRoot, "responsiveness-question-with-error-below.png");
    });

    test("Check question errors bottom one-row", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 800 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              { "type": "text", "name": "question1" },
              {
                "type": "text",
                "name": "question2",
                "startWithNewLine": false,
                "isRequired": true
              },
              {
                "type": "checkbox",
                "name": "question3",
                "choices": ["Item 1", "Item 2", "Item 3"]
              },
              {
                "type": "text",
                "name": "question4",
                "startWithNewLine": false,
                "isRequired": true
              }
            ]
          }
        ],
        "questionErrorLocation": "bottom"
      });
      const pRoot = page.locator(".sd-body");
      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, pRoot, "question-with-error-below-one-line.png");
    });

    test("Check title location Left", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "text",
            name: "q1",
            title: "What is your name?",
            titleLocation: "left"
          }
        ]
      });
      const qRoot = page.locator(".sd-question");
      await compareScreenshot(page, qRoot, "question-title-location-left.png");
    });

    test("Check title location Left - small question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: false,
        "showQuestionNumbers": "off",
        elements: [
          {
            type: "text",
            name: "q1",
            title: "State",
            titleLocation: "left",
            maxWidth: "120px",
            minWidth: "120px"
          }
        ]
      });
      const qRoot = page.locator(".sd-question");
      await compareScreenshot(page, qRoot, "question-title-location-left-small.png");
    });

    test("Composite", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"]
          .ComponentCollection
          .Instance
          .add({
            name: "shippingaddress",
            title: "Shipping Address",
            elementsJSON: [
              {
                type: "text",
                name: "businessAddress",
                title: "Business Address"
              }
            ],
            onCreated(question) {
              question.titleLocation = "hidden";
            }
          });
      });

      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            "type": "shippingaddress",
            "name": "question1"
          }
        ]
      });
      const qRoot = page.locator(".sd-question");
      await compareScreenshot(page, qRoot, "question-composite-hidden-title.png");

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].titleLocation = "default";
      });
      await compareScreenshot(page, qRoot, "question-composite-with-title.png");
    });

    test("Question with title action + long title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            title: "Text long long long long long long long long long long long long long long long",
            placeHolder: "Jon Snow",
            isRequired: true
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [{ title: "Action", action: () => { }, },];
        });
        window["survey"].fromJSON(json);
      }, json);

      const qRoot = page.locator(".sd-question");
      await compareScreenshot(page, qRoot, "question-title-actions-long-title.png");

      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].titleToolbarValue.actions[0].visible = false;
      });
      await compareScreenshot(page, qRoot, "question-hidden-title-actions-long-title.png");
    });

    test("Text question inputType: 'range'", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "Range",
            type: "text",
            inputType: "range",
            isRequired: true
          }
        ]
      };
      await initSurvey(page, framework, json);
      const qRoot = page.locator(".sd-question");
      await compareScreenshot(page, qRoot, "question-text-range.png");
    });

    test("Remaining character counter", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            maxLength: 10,
            defaultValue: "Test"
          }, {
            name: "comment",
            type: "comment",
            maxLength: 10,
            defaultValue: "Test"
          },
          {
            "type": "multipletext",
            "name": "question1",
            "validators": [{ "type": "expression" }],
            "items": [
              { "name": "text1", "maxLength": 10 },
              { "name": "text2", "maxLength": 15 }
            ]
          }]
      });

      await compareScreenshot(page, page.locator(".sd-text__content"), "question-text-remaining-character-counter.png");
      await page.keyboard.press("Tab");
      await compareScreenshot(page, page.locator(".sd-comment__content"), "question-comment-remaining-character-counter.png");
      await page.keyboard.press("Tab");
      await compareScreenshot(page, page.locator(".sd-multipletext__content"), "question-multipletext-remaining-character-counter.png");
    });

    test("Update comment height", async ({ page }) => {
      await page.setViewportSize({ width: 1500, height: 900 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        logoPosition: "right",
        pages: [
          {
            name: "puslapis1",
            validationType: "none",
            elements: [
              {
                type: "comment",
                name: "klausimas1",
                state: "collapsed",
                defaultValueExpression: "'To enhance experience of designers working with large forms in SurveyJS Creator, with v2.0, we plan to introduce the expand/collapse feature for form pages, panels and elements.To enhance experience of designers working with large forms in SurveyJS Creator, with v2.0, we plan to introduce the expand/collapse feature for form pages, panels and elements.'",
                readOnly: true,
                autoGrow: true,
              },
            ],
          },
        ],
        widthMode: "static",
        width: "500px",
        autosaveMode: "ON_BLUR",
      });

      await page.evaluate(() => {
        (window as any).survey.allowResizeComment = false;
        (window as any).survey.autoGrowComment = true;
      });
      const questionRoot = page.locator(".sd-question");
      await questionRoot.click();
      await page.waitForTimeout(500);
      //await page.keyboard.press("Tab"); We do not focus readonly question on expand after fixing #10434 bug. So we do not need press tab to leave the comment, since it was not focused.
      await compareScreenshot(page, questionRoot, "question-comment-ajust-height.png");
    });

    test("Remaining character counter - mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 350, height: 900 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            name: "name",
            type: "text",
            maxLength: 25,
            defaultValue: "Tewwwwwwwwwwwwwwwwwwwwst"
          }, {
            name: "text",
            type: "text",
            maxLength: 100,
            defaultValue: "Tewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwst"
          }, {
            "type": "multipletext",
            "name": "question1",
            "defaultValue": {
              "text1": "Tewwwwwwwwwwwwwwwwwwwwst1",
              "text2": "Tewwwwwwwwwwwwwwwwwwwwst2"
            },
            "items": [
              { "name": "text1", "maxLength": 25 },
              { "name": "text2", "maxLength": 25 }
            ]
          }
        ]
      });
      await page.waitForTimeout(500);
      await page.keyboard.press("Tab");

      await compareScreenshot(page, page.locator(".sd-text__content"), "question-text-remaining-character-counter-mobile-view-with-focus.png");
      await compareScreenshot(page, page.locator(".sd-multipletext__content"), "question-multipletext-remaining-character-counter-mobile-view-without-focus.png");
      await compareScreenshot(page, page.locator(".sd-text__content").nth(1), "question-text-remaining-character-counter-maxLength-100-without-focus.png");

      await page.keyboard.press("Tab");
      await compareScreenshot(page, page.locator(".sd-text__content").nth(1), "question-text-remaining-character-counter-maxLength-100-with-focus.png");

      await page.keyboard.press("Tab");
      await compareScreenshot(page, page.locator(".sd-text__content"), "question-text-remaining-character-counter-mobile-view-without-focus.png");
      await compareScreenshot(page, page.locator(".sd-multipletext__content"), "question-multipletext-remaining-character-counter-mobile-view-with-focus.png");
    });

    test("Remaining character counter inputType is email - mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            inputType: "email",
            maxLength: 25,
            defaultValue: "Tewwwwwwwwwwwwwwwwwwwwst"
          }]
      });
      await compareScreenshot(page, ".sd-question", "question-text-email-character-counter-with-focus.png");

      await page.setViewportSize({ width: 350, height: 900 });
      await compareScreenshot(page, ".sd-question", "question-text-email-character-counter-mobile-view-with-focus.png");
    });

    test("Remaining character counter matrixdynamic", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            "type": "matrixdynamic",
            "name": "relatives",
            "title": "Please enter all blood relatives you know",
            "titleLocation": "hidden",
            "columns": [
              {
                "name": "relativeType",
                "title": "Relative",
                "cellType": "dropdown",
                "isRequired": true,
                "choices": ["father", "mother", "brother", "sister", "son", "daughter"]
              },
              {
                "name": "firstName",
                "title": "First name",
                "cellType": "text",
                "isRequired": true,
                "maxLength": 25
              },
              {
                "name": "lastName",
                "title": "Last name",
                "cellType": "text",
                "isRequired": true,
                "maxLength": 25
              }
            ],
            "detailElements": [
              {
                "type": "radiogroup",
                "name": "isalive",
                "startWithNewLine": false,
                "title": "Alive?",
                "isRequired": true,
                "choices": ["Yes", "No"],
                "colCount": 0
              },
              {
                "type": "dropdown",
                "name": "liveage",
                "visibleIf": "{row.isalive} = 'Yes'",
                "startWithNewLine": false,
                "title": "Age",
                "isRequired": true,
                "choicesMin": 1,
                "choicesMax": 115
              },
              {
                "type": "dropdown",
                "name": "deceasedage",
                "visibleIf": "{row.isalive} = 'No'",
                "startWithNewLine": false,
                "title": "Deceased Age",
                "isRequired": true,
                "choices": [{ "value": -1, "text": "Unknown" }],
                "choicesMin": 1,
                "choicesMax": 115
              },
              {
                "type": "radiogroup",
                "name": "causeofdeathknown",
                "visibleIf": "{row.isalive} = 'No'",
                "startWithNewLine": false,
                "title": "Cause of Death Known?",
                "isRequired": true,
                "choices": ["Yes", "No"],
                "colCount": 0
              },
              {
                "type": "text",
                "name": "causeofdeath",
                "visibleIf": "{row.isalive} = 'No' and {row.causeofdeathknown} = 'Yes'",
                "startWithNewLine": false,
                "title": "Cause of Death",
                "isRequired": true
              }
            ],
            "detailPanelMode": "underRow",
            "rowCount": 1,
            "addRowText": "Add a blood relative",
            "removeRowText": "Remove the relative"
          }]
      });

      await page.waitForTimeout(500);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await compareScreenshot(page, page.locator(".sd-question"), "question-matrixdynamic-remaining-character-counter.png");
    });

    test("Check question with indent", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [{ name: "name", type: "text", indent: 1, }]
      });
      await compareScreenshot(page, ".sd-question", "question-with-indent.png");
    });

    test("Check question with big number", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        questionStartIndex: "1.1.1",
        elements: [{ name: "name", type: "text", }] });
      await compareScreenshot(page, ".sd-question", "question-with-big-number.png");
    });

    test("Check question - baseunit", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.focus();
        document.body.style.setProperty("--base-unit", "4px");
      });

      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            name: "q1",
            type: "text",
            title: "Question",
            description: "Description"
          }
        ]
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "question-baseunit.png");
    });

    test("Check question - multiline description", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.focus();
        document.body.style.setProperty("--base-unit", "4px");
      });

      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            name: "q1",
            type: "text",
            title: "Question",
            description: "First Line\nSecond Line"
          }
        ]
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "question-multiline-description.png");
    });

    test("Question descriptionLocation property", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "autoFocusFirstQuestion": false,
        showQuestionNumbers: false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                name: "q1",
                type: "text",
                title: "description underTitle",
                description: "question-description",
              },
              {
                name: "q2",
                type: "text",
                title: "description underTitle",
                description: "question-description",
                descriptionLocation: "underTitle",
              },
              {
                name: "q3",
                type: "text",
                title: "description empty",
                descriptionLocation: "underTitle",
              },
              {
                name: "q4",
                type: "text",
                title: "description underInput",
                description: "question-description",
                descriptionLocation: "underInput",
              },
              {
                name: "q5",
                type: "text",
                title: "description empty",
                descriptionLocation: "underInput",
              }
            ]
          }
        ]
      });
      const questionRows = page.locator(".sd-row");
      await compareScreenshot(page, questionRows.nth(0), "question-descriptionLocation-underTitle.png");
      await compareScreenshot(page, questionRows.nth(1), "question-descriptionLocation-underTitle.png");
      await compareScreenshot(page, questionRows.nth(2), "question-description-empty.png");
      await compareScreenshot(page, questionRows.nth(4), "question-description-empty.png");
      await compareScreenshot(page, questionRows.nth(3), "question-descriptionLocation-underInput.png");
    });

    test("Question empty title height", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              { "type": "text", "name": "question1" },
              {
                "type": "text",
                "name": "question2",
                "startWithNewLine": false,
                "title": " "
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "800"
      });
      await page.evaluate(() => {
        (window as any).survey.rootElement.getRootNode().querySelector("div")!.style.setProperty("--sjs-font-size", "8px");
      });
      const questionRows = page.locator(".sd-row");
      await compareScreenshot(page, questionRows.nth(0), "question-empty-title-height.png");
    });

    test("Question content scroll", async ({ page }) => {
      await setRowItemFlowDirection(page);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "radiogroup",
                "name": "question2",
                "choices": [
                  { "value": "Item 1", "text": "11111111111111111111111" },
                  { "value": "Item 2", "text": "2222222222222222222222222222" },
                  { "value": "Item 3", "text": "333333333333333" },
                  { "value": "Item 4", "text": "44444444444444444444444444444" },
                  { "value": "Item 5", "text": "555555555555555555555555" },
                  { "value": "Item 6", "text": "6666666666666" },
                  { "value": "Item 7", "text": "7777777777777777777777777" },
                  { "value": "Item 8", "text": "88888888888888888888888888888888888888" }
                ],
                "colCount": 3
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "650"
      });
      const hasHorizontalScroll = await page.locator(".sd-question .sd-selectbase--multi-column").evaluate((el) => {
        return el.scrollWidth > el.clientWidth;
      });
      expect(hasHorizontalScroll).toBeTruthy();

      await compareScreenshot(page, ".sd-question", "question-multicolumn-overflow.png");
    });

    test("Question title linebreak", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question2",
                "title": "Line\nbreak",
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "650"
      });
      const question = page.locator(".sd-question");
      await compareScreenshot(page, question, "question-title-linebreak.png");
    });

    test("Error, Warning, Info notifications", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        "elements": [
          {
            "type": "text",
            "name": "q1",
            "inputType": "number",
            "isRequired": true,
            "validators": [
              {
                "type": "numeric",
                "text": "Error: >150",
                "maxValue": 150,
                "notificationType": "error"
              },
              {
                "type": "numeric",
                "text": "Error: >100",
                "maxValue": 100,
                "notificationType": "error"
              },
              {
                "type": "numeric",
                "text": "Warning: >75",
                "maxValue": 75,
                "notificationType": "warning"
              },
              {
                "type": "numeric",
                "text": "Warning: >70",
                "maxValue": 75,
                "notificationType": "warning"
              },
              {
                "type": "numeric",
                "text": "Info: >50",
                "maxValue": 50,
                "notificationType": "info"
              },
              {
                "type": "numeric",
                "text": "Info: >45",
                "maxValue": 50,
                "notificationType": "info"
              }
            ],
          },
          {
            type: "panel",
            elements: [
              {
                "type": "text",
                "name": "q2",
                "inputType": "number",
                "isRequired": true,
                "validators": [
                  {
                    "type": "numeric",
                    "text": "Error: >150",
                    "maxValue": 150,
                    "notificationType": "error"
                  },
                  {
                    "type": "numeric",
                    "text": "Error: >100",
                    "maxValue": 100,
                    "notificationType": "error"
                  },
                  {
                    "type": "numeric",
                    "text": "Warning: >75",
                    "maxValue": 75,
                    "notificationType": "warning"
                  },
                  {
                    "type": "numeric",
                    "text": "Warning: >70",
                    "maxValue": 75,
                    "notificationType": "warning"
                  },
                  {
                    "type": "numeric",
                    "text": "Info: >50",
                    "maxValue": 50,
                    "notificationType": "info"
                  },
                  {
                    "type": "numeric",
                    "text": "Info: >45",
                    "maxValue": 50,
                    "notificationType": "info"
                  }
                ],
              },
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      await new QuestionText(page, "q2").fill("151");

      await new QuestionText(page, "q1").fill("151");
      await page.getByRole("button", { name: "Complete" }).click();
      await compareScreenshot(page, page.locator(".sd-error").first(), "question-error-notification-type.png");

      await new QuestionText(page, "q1").fill("90");
      await page.getByRole("button", { name: "Complete" }).click();
      await compareScreenshot(page, page.locator(".sd-error--warning").first(), "question-warning-notification-type.png");

      await new QuestionText(page, "q1").fill("51");
      await page.getByRole("button", { name: "Complete" }).click();
      await compareScreenshot(page, page.locator(".sd-error--info").first(), "question-info-notification-type.png");
    });
  });
});