import { frameworks, url, initSurvey, axeOptions, axeContext } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";
const title = "expression";

// Skip one minor case for listbox role in checkbox fieldset
// axeOptions["rules"]["aria-allowed-role"] = {
//   enabled: false
// };
frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check expression", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "expression",
                "name": "question1",
                "expression": "asd"
              },
            ]
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});