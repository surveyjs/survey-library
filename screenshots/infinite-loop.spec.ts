import { frameworks, url, initSurvey, compareScreenshot } from "../e2e/helper";
import { test, expect } from "@playwright/test";

const title = "Infinite Loop Screenshot";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    test("Check infinite loop", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "question1",
                "templateElements": [
                  {
                    "type": "paneldynamic",
                    "name": "question2",
                    "templateElements": [
                      {
                        "type": "paneldynamic",
                        "name": "question3",
                        "templateElements": [
                          {
                            "type": "text",
                            "name": "question4",
                            "defaultValue": "A"
                          }
                        ],
                        "panelCount": 2,
                        "defaultValue": [
                          {
                            "question4": "A"
                          },
                          {
                            "question4": "B"
                          }
                        ]
                      }
                    ],
                    "panelCount": 2,
                    "defaultValue": [
                      {
                        "question3": [
                          {
                            "question4": "A"
                          },
                          {
                            "question4": "B"
                          }
                        ]
                      },
                      {
                        "question3": [
                          {
                            "question4": "C"
                          },
                          {
                            "question4": "D"
                          }
                        ]
                      }
                    ]
                  }
                ],
                "panelCount": 1,
                "defaultValue": [
                  {
                    "question2": [
                      {
                        "question3": [
                          {
                            "question4": "A"
                          },
                          {
                            "question4": "B"
                          }
                        ]
                      },
                      {
                        "question3": [
                          {
                            "question4": "C"
                          },
                          {
                            "question4": "D"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "questionsOnPageMode": "inputPerPage"
      });

      await compareScreenshot(page, ".sd-body", "inf-loop.png");
      await compareScreenshot(page, ".sd-summary", "inf-loop-summary.png");
      await page.getByText("Panel 2").hover();
      await compareScreenshot(page, ".sd-summary", "inf-loop-summary-row-hover.png");

      await page.getByTitle("Edit").last().hover();
      await compareScreenshot(page, ".sd-summary", "inf-loop-summary-button-hover.png");

      await compareScreenshot(page, ".sd-breadcrumbs", "inf-loop-breadcrumbs-one-item.png");
      await page.getByTitle("Edit").last().click();
      await compareScreenshot(page, ".sd-breadcrumbs", "inf-loop-breadcrumbs-two-items.png");
    });
    test("Check infinite loop - empty dynamic panel", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await initSurvey(page, framework, {
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
                ]
              }
            ]
          }
        ],
        "questionsOnPageMode": "inputPerPage"
      });
      await compareScreenshot(page, ".sd-row", "inf-loop-panel-dyn-empty.png");
    });

    test("Check infinite loop - empty dynamic matrix", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "question1",
                "columns": [
                  {
                    "name": "Column 1"
                  },
                  {
                    "name": "Column 2"
                  }
                ],
                "cellType": "text"
              }
            ]
          }
        ],
        "questionsOnPageMode": "inputPerPage"
      });
      await compareScreenshot(page, ".sd-row", "inf-loop-matrix-dyn-empty.png");
    });
  });
});