import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Paneldynamic Screenshot";

var json = {
  showQuestionNumbers: false,
  width: "900px",
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
      removePanelText: "Remove application",
      maxWidth: "768px",
      minWidth: "768px",
      width: "768px"
    },
  ]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Paneldynamic progressTop mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("applications").currentIndex = 2;
      });
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-progress-top.png");

      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].allowRemovePanel = false;
      });
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-without-remove-button.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("applications").panelCount = 0;
      });
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-empty.png");
    });

    test("Paneldynamic list mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1920 });
      await initSurvey(page, framework, json);
      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");

      await resetFocusToBody(page);
      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("applications").displayMode = "list";
      });
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-list.png");
    });

    test("Check paneldynamic with custom actions", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetPanelFooterActions.add((_, opt) => {
          opt.actions.push({
            title: "Duplicate",
            action: () => { }
          });
        });
        window["survey"].fromJSON(json);
      }, json);

      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");

      await resetFocusToBody(page);
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-with-custom-actions.png");
    });

    test("Two Paneldynamics in one row", async ({ page }) => {
      const json = {
        showQuestionNumbers: true,
        elements: [
          {
            type: "panel",
            title: "Panel",
            elements: [
              {
                type: "paneldynamic",
                name: "nested_paneldynamic",
                title: "Paneldynamic",
                panelCount: 1,
                templateElements: [{
                  name: "q2",
                  title: "Text question",
                  type: "text"
                }]
              },
              {
                type: "paneldynamic",
                name: "nested_paneldynamic2",
                title: "Paneldynamic",
                startWithNewLine: false,
                panelCount: 1,
                templateElements: [{
                  name: "q2",
                  title: "Text question",
                  type: "text"
                }]
              }
            ]
          }
        ]
      };
      await page.setViewportSize({ width: 1920, height: 1920 });
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      await compareScreenshot(page, page.locator(".sd-panel").first(), "two-paneldynamic-in-one-row.png");
    });

    test("Navigation panel by tabs", async ({ page }) => {
      const json = {
        showQuestionNumbers: true,
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                type: "paneldynamic",
                name: "relatives",
                title: "Panel Dynamic",
                displayMode: "tab",
                templateTitle: "Information about: {panel.relativeType}",
                templateElements: [
                  {
                    name: "relativeType",
                    type: "dropdown",
                    title: "Relative",
                    choices: [
                      "father",
                      "mother",
                      "brother",
                      "sister",
                      "son",
                      "daughter"
                    ],
                    isRequired: true
                  },
                  {
                    name: "isalive",
                    type: "radiogroup",
                    title: "Alive?",
                    startWithNewLine: false,
                    isRequired: true,
                    colCount: 0,
                    choices: ["Yes", "No"]
                  },
                  {
                    name: "liveage",
                    type: "dropdown",
                    title: "Age",
                    isRequired: true,
                    startWithNewLine: false,
                    visibleIf: "{panel.isalive} = 'Yes'",
                    choicesMin: 1,
                    choicesMax: 115
                  },
                  {
                    name: "deceasedage",
                    type: "dropdown",
                    title: "Deceased Age",
                    isRequired: true,
                    startWithNewLine: false,
                    visibleIf: "{panel.isalive} = 'No'",
                    choices: [
                      {
                        value: -1,
                        text: "Unknown"
                      }
                    ],
                    choicesMin: 1,
                    choicesMax: 115
                  },
                  {
                    name: "causeofdeathknown",
                    type: "radiogroup",
                    title: "Cause of Death Known?",
                    isRequired: true,
                    colCount: 0,
                    startWithNewLine: false,
                    visibleIf: "{panel.isalive} = 'No'",
                    choices: ["Yes", "No"]
                  },
                  {
                    name: "causeofdeath",
                    type: "text",
                    title: "Cause of Death",
                    isRequired: true,
                    startWithNewLine: false,
                    visibleIf:
                  "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
                  }
                ],
                panelCount: 2,
                addPanelText: "Add a blood relative",
                removePanelText: "Remove the relative"
              }
            ]
          }
        ]
      };

      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-tabs-with-title.png");

      await page.hover("button:has-text('Panel 2')");
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-tabs-hover-tab.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("relatives").titleLocation = "hidden";
        (window as any).survey.getQuestionByName("relatives").templateQuestionTitleLocation = "hidden";
      });
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-tabs-without-title.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("relatives").panelCount = 15;
      });
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-tabs-responsiveness.png");

      await page.hover(".sv-dots");
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-tabs-responsiveness-hover.png");
    });

    test("Paneldynamic without buttons", async ({ page }) => {
      const json = {
        showQuestionNumbers: true,
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                type: "paneldynamic",
                name: "relatives",
                title: "Panel Dynamic",
                templateTitle: "Information about: {panel.relativeType}",
                templateElements: [
                  {
                    name: "relativeType",
                    type: "dropdown",
                    title: "Relative",
                    choices: [
                      "father",
                      "mother",
                      "brother",
                      "sister",
                      "son",
                      "daughter"
                    ],
                    isRequired: true
                  },
                  {
                    name: "isalive",
                    type: "radiogroup",
                    title: "Alive?",
                    startWithNewLine: false,
                    isRequired: true,
                    colCount: 0,
                    choices: ["Yes", "No"]
                  },
                  {
                    name: "liveage",
                    type: "dropdown",
                    title: "Age",
                    isRequired: true,
                    startWithNewLine: false,
                    visibleIf: "{panel.isalive} = 'Yes'",
                    choicesMin: 1,
                    choicesMax: 115
                  },
                  {
                    name: "deceasedage",
                    type: "dropdown",
                    title: "Deceased Age",
                    isRequired: true,
                    startWithNewLine: false,
                    visibleIf: "{panel.isalive} = 'No'",
                    choices: [
                      {
                        value: -1,
                        text: "Unknown"
                      }
                    ],
                    choicesMin: 1,
                    choicesMax: 115
                  },
                  {
                    name: "causeofdeathknown",
                    type: "radiogroup",
                    title: "Cause of Death Known?",
                    isRequired: true,
                    colCount: 0,
                    startWithNewLine: false,
                    visibleIf: "{panel.isalive} = 'No'",
                    choices: ["Yes", "No"]
                  },
                  {
                    name: "causeofdeath",
                    type: "text",
                    title: "Cause of Death",
                    isRequired: true,
                    startWithNewLine: false,
                    visibleIf:
                  "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
                  }
                ],
                panelCount: 1,
                maxPanelCount: 1,
                minPanelCount: 1
              }
            ]
          }
        ]
      };

      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-without-buttons.png");
    });

    test("Paneldynamic confirm dialog", async ({ page }) => {
      const json = {
        showQuestionNumbers: true,
        "autoFocusFirstQuestion": true,
        "pages": [
          {
            "name": "page1",
            "elements": [{
              "type": "paneldynamic",
              "panelCount": 1,
              "name": "question1",
              "templateElements": [{ "type": "text", "name": "question2" }],
              "confirmDelete": true
            }]
          }
        ]
      };

      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json);

      await page.keyboard.press("a");
      await page.keyboard.press("b");
      await page.keyboard.press("c");
      await page.keyboard.press("Tab");
      await page.click(".sd-paneldynamic__remove-btn");
      await page.waitForTimeout(1000);
      await compareScreenshot(page, page.locator(".sv-popup--confirm .sv-popup__body-content"), "paneldynamic-confirm-dialog.png");

      await page.evaluate(async () => {
        const applyButton = (window as any).survey.rootElement.getRootNode().querySelector("button[title='OK']");
        const spanText = applyButton?.querySelector("span");
        if (spanText) spanText.innerText = "A very long long long long long text";
      });
      await compareScreenshot(page, page.locator(".sv-popup--confirm .sv-popup__body-content"), "paneldynamic-confirm-dialog--long-button-text.png");
    });

    test("tab focused state for panel dynamic", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "question1",
                "templateElements": [
                  {
                    "type": "text",
                    "name": "question2"
                  }
                ],
                "panelCount": 4,
                "minPanelCount": 4,
                "displayMode": "tab"
              }
            ]
          }
        ]
      });
      await page.click("button[title='Panel 1']");
      await page.keyboard.press("Tab");
      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");
      await compareScreenshot(page, paneldynamicRoot, "paneldynamic-focused-tab.png");
    });

    test("Comment bottom padding in dynamic panel", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "question1",
                "showCommentArea": true,
                "panelCount": 1,
                "templateElements": [
                  {
                    "type": "text",
                    "name": "question2"
                  }
                ]
              }
            ]
          }
        ],
        "showQuestionNumbers": "off"
      };

      await initSurvey(page, framework, json);
      await page.waitForTimeout(100);
      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");
      await compareScreenshot(page, paneldynamicRoot, "panel-dynamic-comment.png");
    });

    test("Paneldynamic: removePanelButtonLocation=right", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        "elements": [
          {
            "type": "paneldynamic",
            "templateElements": [
              {
                "type": "text",
                "name": "q2",
              }
            ],
            "panelCount": 2,
            "removePanelButtonLocation": "right"
          }
        ]
      };
      await initSurvey(page, framework, json);
      const paneldynamicRoot = page.locator(".sd-question--paneldynamic");
      await compareScreenshot(page, paneldynamicRoot, "panel-dynamic-removepanelbuttonlocation-right.png");
    });
  });
});