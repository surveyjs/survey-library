import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Survey Layout";
const pageTitle = "Animals";
const pageDescription = "Animals are multicellular, eukaryotic organisms in the biological kingdom Animalia. With few exceptions, animals consume organic material, breathe oxygen, are able to move, can reproduce sexually, and grow from a hollow sphere of cells, the blastula, during embryonic development.";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Static - with panels", async ({ page }) => {
      await page.setViewportSize({ width: 1800, height: 1000 });

      await initSurvey(page, framework, {
        headerView: "basic",
        "title": "Static",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "static",
        "pages": [{
          "name": "page1",
          "elements": [
            { type: "text", name: "question1", title: "Question", },
            { type: "text", name: "question2", title: "Second Question", }
          ]
        }]
      });

      await resetFocusToBody(page);

      const bodyRoot = page.locator(".sd-container-modern");
      await compareScreenshot(page, bodyRoot, "page-layout-panels-notitle-nodescription.png");

      await page.evaluate((pageTitle) => {
        (window as any).survey.pages[0].title = pageTitle;
        (window as any).survey.render();
      }, pageTitle);
      await compareScreenshot(page, bodyRoot, "page-layout-panels-title-nodescription.png");

      await page.evaluate((pageDescription) => {
        (window as any).survey.pages[0].description = pageDescription;
        (window as any).survey.render();
      }, pageDescription);
      await compareScreenshot(page, bodyRoot, "page-layout-panels-title-description.png");

      await page.evaluate(() => {
        (window as any).survey.pages[0].title = "";
        (window as any).survey.render();
      });
      await compareScreenshot(page, bodyRoot, "page-layout-panels-notitle-description.png");
    });

    test("Static - w/o panels", async ({ page }) => {
      await page.setViewportSize({ width: 1800, height: 1000 });

      await initSurvey(page, framework, {
        headerView: "basic",
        "title": "Static",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "static",
        "pages": [{
          "name": "page1",
          "elements": [
            { type: "text", name: "question1", title: "Question", },
            { type: "text", name: "question2", title: "Second Question", }
          ]
        }]
      });

      await resetFocusToBody(page);
      await page.evaluate(() => {
        (window as any).survey.isCompact = true;
      });

      const bodyRoot = page.locator(".sd-container-modern");
      await compareScreenshot(page, bodyRoot, "page-layout-compact-notitle-nodescription.png");

      await page.evaluate((pageTitle) => {
        (window as any).survey.pages[0].title = pageTitle;
        (window as any).survey.render();
      }, pageTitle);
      await compareScreenshot(page, bodyRoot, "page-layout-compact-title-nodescription.png");

      await page.evaluate((pageDescription) => {
        (window as any).survey.pages[0].description = pageDescription;
        (window as any).survey.render();
      }, pageDescription);
      await compareScreenshot(page, bodyRoot, "page-layout-compact-title-description.png");

      await page.evaluate(() => {
        (window as any).survey.pages[0].title = "";
        (window as any).survey.render();
      });
      await compareScreenshot(page, bodyRoot, "page-layout-compact-notitle-description.png");
    });

    test("Responsive - with panels", async ({ page }) => {
      await page.setViewportSize({ width: 1800, height: 1000 });

      await initSurvey(page, framework, {
        headerView: "basic",
        "title": "Responsive",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "responsive",
        "pages": [{
          "name": "page1",
          "elements": [
            { type: "text", name: "question1", title: "Question", },
            { type: "text", name: "question2", title: "Second Question", }
          ]
        }]
      });

      await resetFocusToBody(page);

      const bodyRoot = page.locator(".sd-container-modern");
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-panels-notitle-nodescription.png");

      await page.evaluate((pageTitle) => {
        (window as any).survey.pages[0].title = pageTitle;
        (window as any).survey.render();
      }, pageTitle);
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-panels-title-nodescription.png");

      await page.evaluate((pageDescription) => {
        (window as any).survey.pages[0].description = pageDescription;
        (window as any).survey.render();
      }, pageDescription);
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-panels-title-description.png");

      await page.evaluate(() => {
        (window as any).survey.pages[0].title = "";
        (window as any).survey.render();
      });
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-panels-notitle-description.png");
    });

    test("Reaponsive - w/o panels", async ({ page }) => {
      await page.setViewportSize({ width: 1800, height: 1000 });

      await initSurvey(page, framework, {
        headerView: "basic",
        "title": "Responsive",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "responsive",
        "pages": [{
          "name": "page1",
          "elements": [
            { type: "text", name: "question1", title: "Question", },
            { type: "text", name: "question2", title: "Second Question", }
          ]
        }]
      });

      await resetFocusToBody(page);
      await page.evaluate(() => {
        (window as any).survey.isCompact = true;
      });

      const bodyRoot = page.locator(".sd-container-modern");
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-compact-notitle-nodescription.png");

      await page.evaluate((pageTitle) => {
        (window as any).survey.pages[0].title = pageTitle;
        (window as any).survey.render();
      }, pageTitle);
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-compact-title-nodescription.png");

      await page.evaluate((pageDescription) => {
        (window as any).survey.pages[0].description = pageDescription;
        (window as any).survey.render();
      }, pageDescription);
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-compact-title-description.png");

      await page.evaluate(() => {
        (window as any).survey.pages[0].title = "";
        (window as any).survey.render();
      });
      await compareScreenshot(page, bodyRoot, "page-layout-responsive-compact-notitle-description.png");
    });
  });
});