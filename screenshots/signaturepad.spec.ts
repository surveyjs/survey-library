import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Signature Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Signature resize to mobile", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "signaturepad",
            name: "q1",
            signatureWidth: 500,
            signatureHeight: 100,
            penMinWidth: 5,
            penMaxWidth: 5,
          },
        ]
      });

      await page.click("canvas", { position: { x: 50, y: 80 } });
      await page.click("canvas", { position: { x: 70, y: 50 } });
      await page.click("canvas", { position: { x: 90, y: 20 } });
      await page.waitForTimeout(100);

      await compareScreenshot(page, ".sd-question", "signature.png");

      await page.setViewportSize({ width: 375, height: 400 });
      await page.click("canvas", { position: { x: 70, y: 20 } });
      await page.click("canvas", { position: { x: 90, y: 30 } });
      await page.waitForTimeout(100);
      await compareScreenshot(page, ".sd-question", "signature-mobile.png");
    });

    test("Signature scaled", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "signaturepad",
            name: "q1",
            signatureWidth: 500,
            signatureHeight: 100,
            penMinWidth: 5,
            penMaxWidth: 5,
            signatureAutoScaleEnabled: true
          },
        ]
      });

      await page.click("canvas", { position: { x: 40, y: 10 } });
      await page.click("canvas", { position: { x: 370, y: 60 } });
      await page.click("canvas", { position: { x: 700, y: 110 } });
      await page.waitForTimeout(100);
      await compareScreenshot(page, ".sd-question", "signature-scaled.png");

      await page.setViewportSize({ width: 500, height: 1080 });
      await page.click("canvas", { position: { x: 20, y: 60 } });
      await page.click("canvas", { position: { x: 160, y: 35 } });
      await page.click("canvas", { position: { x: 300, y: 10 } });
      await page.waitForTimeout(100);
      await compareScreenshot(page, ".sd-question", "signature-scaled-resize.png");

      await page.click("button[title=\"Clear\"]");
      await compareScreenshot(page, ".sd-question", "signature-clear.png");
    });

    test("Signature update from value", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "600px",
        elements: [
          {
            type: "signaturepad",
            name: "q1",
            signatureWidth: 100,
            signatureHeight: 100,
            penMinWidth: 5,
            penMaxWidth: 5,
            signatureAutoScaleEnabled: true
          },
        ]
      });
      await page.waitForTimeout(2000);
      await page.evaluate(() => {
        window["survey"].getQuestionByName("q1").value = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E";
      });
      await compareScreenshot(page, ".sd-question", "signature-data.png");
    });

    test("Signature loadingIndicator", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "600px",
        elements: [
          {
            type: "signaturepad",
            name: "q1",
            storeDataAsText: false,
          },
        ]
      });

      await page.evaluate(() => {
        window["survey"].getQuestionByName("q1").stateChanged("loading");
      });
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        ((window as any).survey.rootElement.getRootNode().querySelector(".sd-loading-indicator .sv-svg-icon") as any).style.animationName = "unset";
      });

      await compareScreenshot(page, ".sd-question", "signature-data-loading.png");
    });

    test("Signature loading preview", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "signaturepad",
            name: "signature",
            "signatureWidth": 100,
            "signatureHeight": 100,
            "dataFormat": "svg",
            storeDataAsText: false
          }
        ],
      });

      await page.evaluate(() => {
        window["survey"].onDownloadFile.add((survey, options) => {
          options.callback(
            "success",
            "data:image/svg+xml,%3Csvg height='100' width='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle r='45' cx='50' cy='50' fill='red'/%3E%3C/svg%3E"
          );
        });
        window["survey"].data = {
          "signature": "file1.png"
        };
      });

      await compareScreenshot(page, ".sd-question", "signature-data-load-preview.png");
    });
  });
});