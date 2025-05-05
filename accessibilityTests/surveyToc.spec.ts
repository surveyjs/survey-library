import { Page, test } from "@playwright/test";
import { frameworks, url, initSurvey, axeOptions } from "./helper";
import { injectAxe, checkA11y } from "axe-playwright";

const title = "Survey TOC";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check toc", async ({ page }) => {
      await initSurvey(page, framework, {
        "title": "Survey",
        "pages": [
          { name: "page1", elements: [{ name: "q1", type: "html" }] },
          { name: "page2", elements: [{ name: "q2", type: "text" }] },
        ],
        "showTOC": true,
        "headerView": "advanced",
        "widthMode": "static",
      });
      await checkA11y(page, ".sv_progress-toc", { axeOptions });
    });
  });
});