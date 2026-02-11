import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";
import { imageSource } from "../visualRegressionTests/constants";

const title = "Responsiveness Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check simple question in small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "text",
            name: "question_with_num",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });

      await compareScreenshot(page, ".sd-question", "responsiveness-simple-question.png");
    });

    test("Check simple question on smartphone screen", async ({ page }) => {
      await page.setViewportSize({ width: 391, height: 712 });
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        "elements": [{
          "name": "username",
          "type": "text",
          "title": "Username",
          "maxLength": 25
        }, {
          "name": "email",
          "type": "text",
          "title": "E-mail address",
          "inputType": "email",
          "placeholder": "foobar@example.com",
          "isRequired": true,
          "autocomplete": "email"
        }, {
          "name": "password",
          "type": "text",
          "title": "Password",
          "description": "Enter 8 characters minimum.",
          "inputType": "password",
          "isRequired": true,
          "autocomplete": "current-password",
          "validators": [{
            "type": "text",
            "minLength": 8,
            "text": "Your password must be at least 8 characters long."
          }]
        }, {
          "name": "url",
          "type": "text",
          "title": "URL",
          "inputType": "url",
          "placeholder": "https://www.example.com",
          "validators": [{
            "type": "regex",
            "regex": "https://.*",
            "text": "Your answer must match the URL pattern."
          }]
        }],
      });

      await compareScreenshot(page, "body", "responsiveness-simple-question-mobile.png");
    });

    test("Check simple question in small screen with rtl", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "text",
            name: "question_with_num",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });

      await compareScreenshot(page, ".sd-question", "responsiveness-simple-question-rtl.png");
    });

    test("Check questions in one row in small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
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
      },);

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-row", "responsiveness-multiple-row.png");
    });

    const panelDynamicJSON = {
      showQuestionNumbers: false,
      elements: [
        {
          type: "paneldynamic",
          name: "applications",
          title: "What application do you use?",
          displayMode: "carousel",
          templateTitle: "{panel.application}",
          templateElements: [
            {
              name: "application",
              type: "dropdown",
              title: "Application",
              defaultValue: "Adobe Photoshop",
              choices: [
                "Adobe Photoshop",
              ],
            },
            {
              name: "often",
              type: "radiogroup",
              title: "How often do you use this applications?",
              choices: ["Rare", "Sometimes", "Always"]
            }
          ],
          panelCount: 2,
          noEntriesText: "You can add as many applications as you want.\nJust click the button below to start.",
          addPanelText: "Add application",
          removePanelText: "Remove application"
        },
      ]
    };

    test("Check paneldynamic progressTop on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, panelDynamicJSON);

      await page.evaluate(() => {
        const panel = (window as any).survey.getQuestionByName("applications");
        panel.isMobile = true;
        panel.currentIndex = 2;
      });
      await compareScreenshot(page, ".sd-question--paneldynamic", "responsiveness-paneldynamic-progress-top.png");
    });

    test("Check paneldynamic list on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, panelDynamicJSON);

      await page.evaluate(() => {
        document.body.focus();
        (window as any).survey.getQuestionByName("applications").displayMode = "list";
      });
      await compareScreenshot(page, ".sd-question--paneldynamic", "responsiveness-paneldynamic-list.png");
    });

    test("Check matrix on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            "type": "matrix",
            "name": "Quality",
            "title": "Please indicate if you agree or disagree with the following statements",
            "columns": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree",],
            "rows": [
              "Product is affordable",
              "Product does what it claims",
              "Product is better than other products on the market"
            ]
          }
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-matrix.png");
    });

    test("Check matrix on small screen - alt rows", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            "type": "matrix",
            "name": "Quality",
            "alternateRows": true,
            "title": "Please indicate if you agree or disagree with the following statements",
            "columns": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree",],
            "rows": [
              "Product is affordable",
              "Product does what it claims",
              "Product is better than other products on the market"
            ]
          }
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-matrix-alt-rows.png");
    });

    test("Check matrixdynamic on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              { "name": "Column 1", "title": "Framework" },
              { "name": "Column 2", "title": "How long do you use it?" },
              { "name": "Column 3", "title": "What is main strength?" }
            ],
            addRowText: "Add a New Record",
            rowCount: 2,
          },
          {
            type: "matrixdynamic",
            name: "frameworks1",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              { "name": "Column 1", "title": "Framework" },
              { "name": "Column 2", "title": "How long do you use it?" },
              { "name": "Column 3", "title": "What is main strength?" }
            ],
            addRowText: "Add a New Record",
            rowCount: 2,
            "addRowButtonLocation": "top"
          },
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, page.locator(".sd-question").first(), "responsiveness-matrixdynamic.png");
      await compareScreenshot(page, page.locator(".sd-question").nth(1), "responsiveness-matrixdynamic-add-top.png");
    });

    test("Check matrixdynamic on small screen with errors", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              {
                "name": "Column 1",
                "isRequired": true,
                "title": "Framework"
              },
              {
                "name": "Column 2",
                "title": "How long do you use it?"
              },
              {
                "name": "Column 3",
                "isRequired": true,
                "title": "What is main strength?"
              }
            ],
            addRowText: "Add a New Record",
            rowCount: 2,
          },
        ]
      });

      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-matrixdynamic-with-errros.png");
    });

    test("Check matrixdynamic on small screen with errors bottom", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        questionErrorLocation: "bottom",
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              {
                "name": "Column 1",
                "isRequired": true,
                "title": "Framework"
              },
              {
                "name": "Column 2",
                "title": "How long do you use it?"
              },
              {
                "name": "Column 3",
                "isRequired": true,
                "title": "What is main strength?"
              }
            ],
            addRowText: "Add a New Record",
            rowCount: 2,
          },
        ]
      });

      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-matrixdynamic-with-errros-bottom.png");
    });

    test("Check matrixdropdown on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "matrixdropdown",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            "rows": ["AngularJS", "ReactJS"],
            "columns": [
              {
                "name": "using",
                "title": "Do you use it?",
                "choices": ["Yes", "No"],
                "colCount": 1,
                "cellType": "radiogroup"
              }, {
                "name": "strength",
                "title": "What is main strength?",
                "choices": ["Easy", "Compact", "Fast", "Powerfull"],
                "colCount": 1,
                "cellType": "checkbox"
              },
            ],
          },
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-matrixdropdown.png");
    });

    test("Check multipletext on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "multipletext",
            name: "q1",
            title: "Personal Information",
            colCount: 2,
            items: [
              { name: "item1", title: "Full Name" },
              { name: "item2", title: "Email Address" },
              { name: "item3", title: "ID" },
            ]
          },
        ]
      });

      await compareScreenshot(page, ".sd-question", "responsiveness-multipletext-empty.png");
      await page.locator(".sd-formbox__input").first().click();
      await compareScreenshot(page, ".sd-question", "responsiveness-multipletext-focus.png");
      await page.locator(".sd-formbox__input").nth(0).fill("Jon Snow");
      await page.locator(".sd-formbox__input").nth(2).fill("jon@snow.com");
      await page.locator(".sd-formbox__input").nth(4).fill("1234-56789");
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-multipletext.png");
    });

    test("Check multipletext with inputType 'date' on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "multipletext",
            name: "q1",
            title: "Personal Information",
            colCount: 2,
            items: [
              {
                name: "item1",
                inputType: "date",
                title: "Depature Date "
              },
              {
                name: "item2",
                inputType: "date",
                title: "Arrival Date "
              },
            ]
          },
        ]
      });

      await compareScreenshot(page, ".sd-question", "responsiveness-multipletext-date-empty.png");
      await page.locator(".sd-formbox__input").first().click();
      await compareScreenshot(page, ".sd-question", "responsiveness-multipletext-date-focus.png");
      await page.locator(".sd-formbox__input").nth(1).fill("2004-01-12");
      await page.locator(".sd-formbox__input").nth(2).click();
      await page.locator(".sd-formbox__input").nth(3).fill("2004-02-12");
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-multipletext-date.png");
    });

    test("Check multicolumn checkbox question on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "checkbox",
            title: "Which cities have you visited?",
            name: "checkbox_question",
            choices: ["Moscow", "Paris", "Madrid", "Munich", "London", "None"],
            colCount: 2
          },
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-checkbox-col-count-2.png");
    });

    test("Check multicolumn checkbox question doesn't fit width", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        "widthMode": "static",
        "width": "60%",
        elements: [
          {
            "type": "checkbox",
            "name": "contract-type",
            "title": "Type of contract ",
            "choices": [
              { "value": "Item 1", "text": "Permanent" },
              { "value": "Item 2", "text": "Fixed-Term" },
              { "value": "Item 3", "text": "All year round" },
              { "value": "Item 4", "text": "Term-time only" },
              { "value": "Item 5", "text": "Annualized" }
            ],
            "colCount": 5
          }
        ],
        "autoFocusFirstQuestion": true // do not remove, it is need to check container clipping
      });

      await compareScreenshot(page, ".sd-question", "responsiveness-checkbox-col-count-5-wide.png");
      await page.setViewportSize({ width: 1000, height: 1080 });
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-checkbox-col-count-5-small.png");
    });

    test("Check image question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "image",
            name: "image_question",
            imageLink: imageSource
          },
        ]
      });

      await compareScreenshot(page, ".sd-question", "responsiveness-image-max-width.png");
      await page.setViewportSize({ width: 500, height: 1080 });
      await compareScreenshot(page, ".sd-question", "responsiveness-image.png");
    });

    test("Check ranking question on small screen", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "ranking",
            title: "Tell me about a time you strongly disagreed with your manager. What did you do to convince him or her that you were right? What happened?",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"]
          }
        ]
      });

      await compareScreenshot(page, ".sd-question", "responsiveness-ranking.png");
      await page.hover(".sv-ranking-item");
      await compareScreenshot(page, ".sd-question", "responsiveness-ranking-hover-item.png");
    });

    test("check survey layout in mobile mode", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework,
        {
          showQuestionNumbers: true,
          autoFocusFirstQuestion: true,
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          pages: [{
            name: "page1",
            title: "Page1",
            description: "description",
            elements: [{
              type: "text",
              name: "q1",
              title: "Question 1",
            },
            {
              type: "text",
              name: "q2",
              title: "Question 2",
            }]
          },
          {
            name: "page2",
            title: "Page2",
            description: "description",
            elements: [{
              type: "text",
              name: "q3",
              title: "Question 3",
            },
            {
              type: "text",
              name: "q2",
              title: "Question 4",
            }]
          }]
        }
      );

      await compareScreenshot(page, ".sd-root-modern", "responsiveness-survey-layout-page1.png");
      await page.evaluate(() => { (window as any).survey.widthMode = "responsive"; });
      await compareScreenshot(page, ".sd-root-modern", "responsiveness-survey-layout-page1.png");
      await page.evaluate(() => { (window as any).survey.nextPage(); });
      await compareScreenshot(page, ".sd-root-modern", "responsiveness-survey-layout-page2.png");
      await page.evaluate(() => { (window as any).survey.widthMode = "static"; });
      await compareScreenshot(page, ".sd-root-modern", "responsiveness-survey-layout-page2.png");
    });

    test("check matrix-dynamic-detail in mobile mode", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 2000 });
      await initSurvey(page, framework,
        {
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          showQuestionNumbers: false,
          elements: [{
            "type": "matrixdynamic",
            "name": "question1",
            "title": "Users",
            "columns": [
              { "name": "Column 1", "title": "Name" },
              { "name": "Column 2", "title": "Email" },
              { "name": "Column 3", "title": "Role" }
            ],
            "detailElements": [
              {
                "type": "text",
                "name": "question3",
                "title": "Phone"
              },
              {
                "type": "text",
                "name": "question4",
                "title": "Department"
              }
            ],
            "detailPanelMode": "underRow",
            "cellType": "text",
            "rows": ["Row 1", "Row 2"]
          }]
        }
      );

      await compareScreenshot(page, ".sd-question", "responsiveness-matrix-dynamic-detail.png");
      await page.click("button:has-text('Show Details')");
      await compareScreenshot(page, ".sd-question", "responsiveness-matrix-dynamic-detail-open.png");
    });

    test("check matrix-dropdown-detail in mobile mode", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 2080 });
      await initSurvey(page, framework,
        {
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          showQuestionNumbers: false,
          elements: [{
            "type": "matrixdropdown",
            "name": "question1",
            "title": "Users",
            "columns": [
              { "name": "Column 1", "title": "Name" },
              { "name": "Column 2", "title": "Email" },
              { "name": "Column 3", "title": "Role" }
            ],
            "detailElements": [
              {
                "type": "text",
                "name": "question3",
                "title": "Phone"
              },
              {
                "type": "text",
                "name": "question4",
                "title": "Department"
              }
            ],
            "detailPanelMode": "underRow",
            "cellType": "text",
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }]
        }
      );

      await compareScreenshot(page, ".sd-question", "responsiveness-matrix-dropdown-detail.png");
      await page.click("button:has-text('Show Details')");
      await compareScreenshot(page, ".sd-question", "responsiveness-matrix-dropdown-detail-open.png");
    });

    test("check matrix-dropdown-text in mobile mode", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework,
        {
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          showQuestionNumbers: false,
          elements: [{
            "type": "matrixdropdown",
            "name": "question1",
            "title": "Users",
            "columns": [
              { "name": "Column 1", "title": "Name" },
              { "name": "Column 2", "title": "Email" },
              { "name": "Column 3", "title": "Role" }
            ],
            "cellType": "text",
            "rows": ["Row 1", "Row 2"]
          }]
        }
      );

      await compareScreenshot(page, ".sd-question", "responsiveness-matrixdropdown-text-fields.png");
    });

    test("check matrixdropdown with totals in mobile mode", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1920 });
      await initSurvey(page, framework,
        {
          showQuestionNumbers: true,
          "pages": [
            {
              "name": "page1",
              "elements": [
                {
                  "type": "matrixdropdown",
                  "name": "question1",
                  "columns": [
                    { "name": "Column 1", "totalType": "sum" },
                    { "name": "Column 2", "totalType": "count" },
                    { "name": "Column 3", "totalType": "max" }
                  ],
                  "choices": [1, 2, 3, 4, 5],
                  "rows": ["Row 1", "Row 2"],
                  "totalText": "Total:"
                }
              ]
            }
          ]
        }
      );

      await compareScreenshot(page, ".sd-question", "responsiveness-matrixdropdown-totals.png");
    });

    test("Check matrixdynamic with totals in one column in mobile mode", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            "type": "matrixdynamic", "name": "question1",
            "columns": [
              { "name": "rowIndexCol", "title": " ", "cellType": "expression", "totalType": "count", "totalFormat": "Total = {0}", "expression": "{rowIndex}" },
              { "name": "Column 1" },
              { "name": "Column 2" },
              { "name": "Column 3" }
            ],
            "choices": [1, 2, 3, 4, 5]
          },
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "responsiveness-matrixdynamic-totals.png");
    });
  });
});