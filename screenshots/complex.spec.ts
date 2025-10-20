import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Complex Screenshot";

const json = {
  showQuestionNumbers: false,
  width: "900px",
  elements: [
    {
      type: "Paneldynamic",
      title: "My Order",
      name: "order",
      displayMode: "carousel",
      progressBarLocation: "bottom",
      templateTitle: "{panel.itemName}",
      removePanelText: "Remove Item",
      panelCount: 5,
      minWidth: "708px",
      maxWidth: "708px",
      width: "708px",
      templateElements: [
        {
          type: "text",
          name: "itemName",
          title: "Item Name",
          defaultValue: "Converse Chuck Taylor"
        },
        {
          type: "text",
          name: "count",
          title: "Count",
          defaultValue: "1",
          startWithNewLine: false,
        },
        {
          type: "panel",
          name: "shipping",
          title: "Shipping",
          elements: [
            {
              type: "radiogroup",
              name: "delivery",
              title: "Delivery",
              choices: ["DHL", "Pony Express", "FedEx"],
              defaultValue: "FedEx"
            },
            {
              type: "boolean",
              name: "fast",
              title: "Would you like to get the order as fast as it possible?",
              defaultValue: true
            },
            {
              type: "matrix",
              name: "best_delivery",
              title: "What's the best delivery time for you?",
              "columns": ["Morning", "Afternoon", "Evening"],
              "rows": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              defaultValue: {
                "Monday": "Afternoon",
                "Tuesday": "Afternoon",
                "Wednesday": "Morning",
                "Thursday": "Morning",
                "Friday": "Evening"
              }
            }
          ]
        },
        {
          type: "panel",
          name: "blilling",
          title: "Billing",
          state: "collapsed",
          elements: [{ "type": "text", name: "dummy" }]
        }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check complex question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1800 });

      await page.evaluate(() => {
        (window as any).Survey.surveyLocalization.locales.en.panelDynamicProgressText = "{0} of {1}";
      });

      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        const panel = (window as any).survey.getQuestionByName("order");
        panel.currentIndex = 4;
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "complex-question.png");
    });
  });
});