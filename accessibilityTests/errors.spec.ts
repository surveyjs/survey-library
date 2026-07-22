import { frameworks, url, initSurvey } from "./helper";
import { test, expect } from "@playwright/test";
const title = "errors";

const json = {
  "elements": [
    {
      "type": "text",
      "name": "q1",
      "title": "First Name",
      "isRequired": true
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    // The error container must be a live region so that a validation error is
    // announced by assistive technology even when focus is on another field
    // (WCAG 2.1 Success Criterion 4.1.3).
    test("error container is a live region", async ({ page }) => {
      await initSurvey(page, framework, json);
      await page.evaluate(() => { (window as any).survey.validate(true); });
      const errbox = page.locator("[id$=\"_errors\"]");
      await expect(errbox).toBeVisible();
      await expect(errbox).toHaveAttribute("role", "alert");
      await expect(errbox).toHaveAttribute("aria-live", "polite");
      await expect(errbox).toHaveAttribute("aria-atomic", "true");
    });
  });
});
