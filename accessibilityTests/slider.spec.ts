import { frameworks, url, initSurvey, axeContext, axeOptions } from "./helper";
import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";
const title = "slider";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check slider", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "slider",
            sliderType: "single",
            name: "q1",
            title: "Please choose a value...",
            defaultValue: 50
          },
          {
            type: "slider",
            sliderType: "range",
            name: "q2",
            title: "Please choose a range value..."
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});