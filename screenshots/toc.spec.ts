import { frameworks, url, initSurvey, compareScreenshot } from "../e2e/helper";
import { test, expect } from "@playwright/test";

const title = "TOC Screenshot";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    test("Check TOC on the first page after start", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await initSurvey(page, framework, {
        "title": "Survey",
        "pages": [
          { name: "page1", elements: [{ name: "q1", type: "html" }] },
          { name: "page2", elements: [{ name: "q2", type: "text" }] },
        ],
        "showTOC": true,
        "firstPageIsStartPage": true,
        "headerView": "advanced",
        "widthMode": "static",
      });
      const start = page.locator(".sd-navigation__start-btn");
      await start.click();
      const toc = page.locator(".sv_progress-toc");
      const tocBox = await toc.boundingBox();
      await expect(tocBox?.height).toBeGreaterThan(300);
      await compareScreenshot(page, ".sv_progress-toc", "toc-first-page-after-start.png");
    });
  });
});