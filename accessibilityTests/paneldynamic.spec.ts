import { Page, expect } from "@playwright/test";
import { assignDeferredSource } from "../e2e/remoteSourceHelper";
import { frameworks, url, initSurvey, axeOptions, baseTest as test } from "./helper";
import { injectAxe, checkA11y } from "axe-playwright";

const title = "Paneldynamic";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check paneldynamic", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "relatives26",
                "title": "Panel Dynamic",
                "templateElements": [
                  {
                    "type": "dropdown",
                    "name": "relativeType27",
                    "title": "Relative",
                    "choices": ["father", "mother", "brother", "sister", "son", "daughter"]
                  },
                  {
                    "type": "radiogroup",
                    "name": "isalive28",
                    "startWithNewLine": false,
                    "title": "Alive?",
                    "choices": ["Yes", "No"],
                    "colCount": 0
                  }
                ],
                "templateTitle": "Information about: {panel.relativeType}",
                "panelCount": 2,
                "addPanelText": "Add a blood relative",
                "removePanelText": "Remove the relative",
                "displayMode": "carousel"
              },
            ]
          }
        ],
        "questionErrorLocation": "bottom"
      });
      await checkA11y(page, ".sd-question", { axeOptions });
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title} loading overlay`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check paneldynamic while its data loads", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, pageSize: 2, templateElements: [{ type: "text", name: "col1" }] }]
      });
      await assignDeferredSource(page, "panel", 6);
      await expect(page.locator(".sd-records__loading-overlay")).toBeVisible();
      await checkA11y(page, ".sd-question", { axeOptions });
    });
  });
});
