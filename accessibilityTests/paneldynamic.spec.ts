import { Page, test } from "@playwright/test";
import { frameworks, url, initSurvey, axeOptions } from "./helper";
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