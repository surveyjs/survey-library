import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Panel Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check oridinary panel", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await compareScreenshot(page, panelRoot, "panel.png");
    });

    test("Check panel with elements in one line", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Contact",
            minWidth: "780px",
            maxWidth: "780px",
            width: "780px",
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
          },
        ]
      });
      await resetFocusToBody(page);
      const panelRoot = page.locator(".sd-panel");
      await compareScreenshot(page, panelRoot, "panel-elements-one-row.png");
    });

    test("Check panel expand/collapse", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            state: "collapsed",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });

      const panelRoot = page.locator(".sd-panel");
      await compareScreenshot(page, panelRoot, "panel-collapse.png");
      await panelRoot.locator(".sd-panel__title").click();
      await compareScreenshot(page, panelRoot, "panel-expand.png");
    });

    test("Check panel expand/collapse - rtl", async ({ page }) => {
      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });

      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "details",
            title: "Please answer",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            state: "collapsed",
            elements: [{ type: "text", name: "question", }] },
        ]
      });

      const panelRoot = page.locator(".sd-panel");
      await compareScreenshot(page, panelRoot, "panel-collapse-rtl.png");
      await panelRoot.locator(".sd-panel__title").click();
      await compareScreenshot(page, panelRoot, "panel-expand-rtl.png");

      await page.setViewportSize({ width: 400, height: 1080 });
      await compareScreenshot(page, panelRoot, "panel-expand-mobile-rtl.png");

      await page.evaluate(() => {
        document.body.setAttribute("dir", "ltr");
      });
    });

    test("Check invisible panel when showInvisibleElements: true", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            visible: false,
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await page.evaluate(() => { (window as any).survey.showInvisibleElements = true; });
      await resetFocusToBody(page);
      await compareScreenshot(page, panelRoot, "panel-invisible.png");
    });

    test("Check panel in row", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            type: "html",
            name: "question0",
            html: "HTML1",
            title: "Question title",
            titleLocation: "hidden"
          },
          {
            type: "panel",
            name: "name",
            showQuestionNumbers: false,
            startWithNewLine: false,
            elements: [
              {
                type: "html",
                name: "question1",
                html: "HTML2",
                title: "Question title",
                titleLocation: "hidden"
              }
            ]
          }
        ]
      });
      await page.evaluate(() => { (window as any).survey.showInvisibleElements = true; });
      await resetFocusToBody(page);
      const rowRoot = page.locator(".sd-row");
      await compareScreenshot(page, rowRoot, "panel-in-row.png");
    });

    test("Check panel with actions", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "pages": [
          {
            "name": "page0",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          },
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1"
                  }
                ]
              }
            ]
          }
        ]
      });

      await page.evaluate(() => {
        var panel = (window as any)["survey"].getAllPanels()[0];
        var locstr = new (window as any)["Survey"].LocalizableString(panel);
        locstr.text = "Edit";
        panel.footerActions.push({ id: "test", locTitle: locstr });
      });

      await page.click("input[title=Next]");
      const panelRoot = page.locator(".sd-panel");
      await compareScreenshot(page, panelRoot, "panel-with-actions.png");
    });

    test("Check preview mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            type: "text",
            name: "question1",
            title: "Question title",
          }
        ]
      });
      await page.fill(".sd-input", "This is my answer");
      await resetFocusToBody(page);
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      const panelRoot = page.locator(".sd-panel");
      await compareScreenshot(page, panelRoot, "panel-preview-mode.png");
    });

    test("Check preview mode for multi-rows", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page2",
            "elements": [
              {
                "type": "text",
                "name": "question5",
                "title": "First name"
              },
              {
                "type": "text",
                "name": "question6",
                "startWithNewLine": false,
                "title": "Last name"
              },
              {
                "type": "text",
                "name": "question7",
                "title": "Address"
              },
              {
                type: "panel",
                "name": "dd",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1",
                    "title": "First name"
                  },
                  {
                    "type": "text",
                    "name": "question2",
                    "startWithNewLine": false,
                    "title": "Last name"
                  },
                  {
                    "type": "text",
                    "name": "question3",
                    "title": "Address"
                  },
                ]
              },
            ]
          },
        ],
        "showQuestionNumbers": "off",
        "questionsOnPageMode": "singlePage",
        "showPreviewBeforeComplete": true,
        "widthMode": "static",
        "width": "800"
      });
      await resetFocusToBody(page);
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      const panelRoot = page.locator(".sd-panel--as-page");
      await compareScreenshot(page, panelRoot, "panel-preview-mode-multi.png");
    });

    test("Check preview mode for multi-rows Panelless", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page2",
            "elements": [
              {
                "type": "text",
                "name": "question5",
                "title": "First name"
              },
              {
                "type": "text",
                "name": "question6",
                "startWithNewLine": false,
                "title": "Last name"
              },
              {
                "type": "text",
                "name": "question7",
                "title": "Address"
              },
              {
                type: "panel",
                "name": "dd",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1",
                    "title": "First name"
                  },
                  {
                    "type": "text",
                    "name": "question2",
                    "startWithNewLine": false,
                    "title": "Last name"
                  },
                  {
                    "type": "text",
                    "name": "question3",
                    "title": "Address"
                  },
                ]
              },
            ]
          },
        ],
        "showQuestionNumbers": "off",
        "questionsOnPageMode": "singlePage",
        "showPreviewBeforeComplete": true,
        "widthMode": "static",
        "width": "800"
      });
      await page.evaluate(() => {
        const themeJson = {
          "isPanelless": true
        };
        (window as any).survey.applyTheme(themeJson);
      });
      const panelRoot = page.locator(".sd-panel--as-page");
      await compareScreenshot(page, panelRoot, "panel-multi-panelless.png");
      await resetFocusToBody(page);
      await page.evaluate(() => {
        (window as any).survey.showPreview();
      });
      await compareScreenshot(page, panelRoot, "panel-preview-mode-multi-panelless.png");
    });

    test("Two panels - one row, small screen", async ({ page }) => {
      await page.setViewportSize({ width: 722, height: 1000 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            "type": "panel",
            "name": "panel1",
            "elements": [
              {
                "type": "panel",
                "name": "panel2",
                "elements": [{ "type": "text", "name": "question1" }],
                "title": "Panel 2",
                "startWithNewLine": false
              },
              {
                "type": "panel",
                "name": "panel3",
                "elements": [{ "type": "text", "name": "question2" }],
                "title": "Panel 3",
                "startWithNewLine": false
              }
            ],
            "title": "Panel 1"
          },
        ]
      });
      await resetFocusToBody(page);
      const panelRoot = page.locator(".sd-panel");
      await compareScreenshot(page, panelRoot, "two-panels-one-row-small-screen.png");
    });

    test("Check panel with errors above", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                isRequired: true,
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                isRequired: true,
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await page.click("input[value='Complete']");
      await compareScreenshot(page, panelRoot, "panel-with-question-errors-above.png");
    });

    test("Check panel with errors and question title location left", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                isRequired: true,
                titleLocation: "left",
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                isRequired: true,
                titleLocation: "left",
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await page.click("input[value='Complete']");
      await compareScreenshot(page, panelRoot, "panel-with-question-title-left-and-errors-above.png");
    });

    test("Check panel with errors below", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        questionErrorLocation: "bottom",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                isRequired: true,
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                isRequired: true,
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await page.click("input[value='Complete']");
      await compareScreenshot(page, panelRoot, "panel-with-question-errors-below.png");
    });

    test("Check panel with number", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            showNumber: true,
            elements: [
              {
                type: "text",
                name: "delivery_agent",
                isRequired: true,
                title: "Delivery agent",
              },
            ]
          },
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await compareScreenshot(page, panelRoot, "panel-with-number.png");
    });

    test("Check panel with singlePage mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        questionsOnPageMode: "singlePage",
        pages: [
          {
            title: "Page title",
            description: "Page description",
            elements: [{
              name: "username",
              type: "text",
              title: "Username",
            }, {
              name: "email",
              type: "text",
              title: "E-mail address"
            }, {
              name: "password",
              type: "text",
              title: "Password"
            }]
          }]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await compareScreenshot(page, panelRoot, "panel-single-page.png");
    });

    test("Check panel with singlePage mode - one line", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        questionsOnPageMode: "singlePage",
        pages: [
          {
            title: "Page title",
            description: "Page description",
            elements: [{
              name: "username",
              type: "text",
              title: "Username",
            }, {
              name: "email",
              type: "text",
              title: "E-mail address",
              startWithNewLine: false
            }, {
              name: "password",
              type: "text",
              title: "Password",
              startWithNewLine: false
            }]
          }]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await compareScreenshot(page, panelRoot, "panel-single-page-one-line.png");
    });

    test("Check multiple panels with singlePage mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        questionsOnPageMode: "singlePage",
        pages: [
          {
            title: "Page title",
            description: "Page description",
            elements: [
              {
                name: "username",
                type: "text",
                title: "Username",
              }
            ]
          },
          {
            title: "Page title 2",
            description: "Page description 2",
            elements: [
              {
                name: "email",
                type: "text",
                title: "email",
              }
            ]
          }
        ]
      });
      const panelRoot = page.locator(".sd-container-modern");
      await resetFocusToBody(page);
      await compareScreenshot(page, panelRoot, "multiple-panels-single-page.png");
    });

    test("Check inner panel with singlePage mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        questionsOnPageMode: "singlePage",
        pages: [
          {
            title: "Page",
            elements: [
              {
                "type": "panel",
                "name": "panel",
                "elements": [
                  {
                    "type": "text",
                    "name": "question2"
                  },
                  {
                    "type": "text",
                    "name": "question1"
                  }
                ],
                "title": "Panel"
              }
            ]
          }
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await compareScreenshot(page, panelRoot, "inner-panel-single-page.png");
    });

    test("Check collapsed questions inside panel", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            "type": "panel",
            "name": "panel",
            "elements": [
              {
                "type": "text",
                state: "collapsed",
                "name": "question2"
              },
              {
                "type": "text",
                state: "collapsed",
                "name": "question1"
              }
            ],
            "title": "Panel"
          }
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await compareScreenshot(page, panelRoot, "collapsed-questions-inside-panel.png");
      await page.hover(".sd-question__header");
      await compareScreenshot(page, panelRoot, "collapsed-questions-inside-panel-hover.png");
    });

    test("Check panel with errors", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            "type": "panel",
            "name": "panel",
            "isRequired": true,
            "title": "Panel",
            "elements": [{ "type": "text", "name": "question2" }],
          }
        ]
      });
      await page.waitForTimeout(500);

      const panelRoot = page.locator(".sd-panel");
      await page.click("input[value='Complete']");
      await compareScreenshot(page, panelRoot, "panel-with-errors.png");
    });

    test("Check panel with errors without title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            "type": "panel",
            "name": "panel",
            "isRequired": true,
            "elements": [{ "type": "text", "name": "question2" }],
          }
        ]
      });
      const panelRoot = page.locator(".sd-panel");
      await resetFocusToBody(page);
      await page.click("input[value='Complete']");
      await compareScreenshot(page, panelRoot, "panel-with-errors-without-title.png");
    });

    test("Check question min size inside panels in design mode", async ({ page }) => {
      await page.setViewportSize({ width: 370, height: 800 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "panel",
                    "name": "panel2",
                    "elements": [
                      {
                        "type": "panel",
                        "name": "panel3",
                        "elements": [
                          {
                            "type": "text",
                            "name": "question1"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        (window as any).survey.setDesignMode(true);
        (window as any).survey.setIsMobile(true);
      });
      await page.waitForTimeout(500);
      await resetFocusToBody(page);

      const panelRoot = page.locator(".sd-body");
      await compareScreenshot(page, panelRoot, "responsive-question-inside-panels-in-creator.png");
    });

    test("Scroll into view if needed on expanding panel", async ({ page }) => {
      await page.setViewportSize({ width: 400, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        showNavigationButtons: false,
        width: "500px",
        elements: [
          { type: "comment", name: "q1" },
          { type: "comment", name: "q2" },
          { type: "comment", name: "q3" },
          { type: "comment", name: "q4" },
          {
            type: "panel", name: "panel", state: "collapsed",
            elements: [
              { type: "comment", name: "panel_q1" },
              { type: "comment", name: "panel_q2" }
            ]
          },
        ]
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.locator(".sd-panel__title").click();
      await compareScreenshot(page, undefined, "panel-scroll-on-expand.png");
    });
  });
});