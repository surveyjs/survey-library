import { frameworks, url, initSurvey, axeContext, axeOptions } from "./helper";
import { test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";
const title = "ranks";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check rating", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check ranking", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "ranking",
            name: "smartphone-features",
            title: "Please rank the following smartphone features in order of importance:",
            choices: [
              "Battery life",
              "Screen size",
              "Storage space",
              "Camera quality",
              "Durability",
              "Processor power",
              "Price",
            ],
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});