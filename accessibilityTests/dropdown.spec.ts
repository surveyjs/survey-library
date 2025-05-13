import { checkA11y, injectAxe } from "axe-playwright";
import { axeContext, axeOptions, frameworks, initSurvey, url } from "./helper";
import { test, expect } from "@playwright/test";
const title = "Dropdown";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("dropdowns", async ({ page }) => {
      const json = {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "dropdown",
                "name": "question1",
                "isRequired": true,
                "choices": ["Item 1", "Item 2", "Item 3"]
              },
              {
                "type": "dropdown",
                "name": "question2",
                "searchEnabled": false,
                "choices": ["Item 1", "Item 2", "Item 3"],
              },
              {
                "type": "dropdown",
                "name": "question3",
                "readOnly": true,
                "choices": ["Item 1", "Item 2", "Item 3"]
              },
              {
                "type": "dropdown",
                "name": "question4",
                "defaultValue": "Item 2",
                "choices": ["Item 1", "Item 2", "Item 3"]
              },
              {
                "type": "dropdown",
                "name": "question5",
                "defaultValue": "Item 2",
                "readOnly": true,
                "choices": ["Item 1", "Item 2", "Item 3"]
              }
            ]
          }
        ],
      };
      await initSurvey(page, framework, json);
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});