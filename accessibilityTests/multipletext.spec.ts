import { frameworks, url, initSurvey, axeOptions, axeContext, getButtonByText } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";
const title = "multipletextbox";
frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check multipletextbox - validation", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "name": "expressionvalidator",
                "type": "multipletext",
                "title": "Expression Validator",
                "description": "Specify a range of numbers",
                "isRequired": true,
                "items": [{
                  "name": "minvalue",
                  "title": "Minimum value",
                  "isRequired": true,
                  "validators": [
                    { "type": "numeric" }
                  ]
                }, {
                  "name": "maxvalue",
                  "title": "Maximum value",
                  "isRequired": true,
                  "validators": [
                    { "type": "numeric" }
                  ]
                }] }
            ]
          }
        ]
      });
      await getButtonByText(page, "Complete").click();
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});