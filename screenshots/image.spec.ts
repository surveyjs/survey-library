import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";
import { imageSource } from "../visualRegressionTests/constants";

const title = "Image Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check image question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        widthMode: "responsive",
        elements: [
          {
            type: "image",
            name: "image_question",
            imageWidth: "1024px",
            imageHeight: "465px",
            minWidth: "1024px",
            maxWidth: "1024px",
            width: "1024px",
            imageLink: imageSource
          },
        ]
      });
      await page.waitForLoadState("networkidle");

      const questionRoot = page.locator(".sd-question--image");
      await compareScreenshot(page, questionRoot, "image-question.png");
    });

    test("Check image in-row question", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "image",
            name: "image_question",
            imageWidth: "200px",
            imageHeight: "100px",
            imageLink: imageSource
          },
          {
            type: "image",
            name: "image_question",
            imageWidth: "200px",
            imageHeight: "100px",
            imageLink: imageSource,
            startWithNewLine: false
          },
        ]
      });
      await page.waitForLoadState("networkidle");

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "image-question-row.png");
    });

    test("Check image loading is broken", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          { "type": "image", "name": "noimage",
            "imageLink": "https://surveyjs.io/Cos/image-picker/panda.jpg"
          }
        ]
      });
      await page.waitForLoadState("networkidle");

      const questionRoot = page.locator(".sd-question--image");
      await compareScreenshot(page, questionRoot, "image-not-load.png");
    });

    test("Check image question responsive width when image is located in row with multiple elements", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          { "type": "text", "name": "q1", },
          {
            "type": "image",
            "name": "q2",
            "imageLink": "http://localhost:8080/test-resources/logo.jpg",
            "startWithNewLine": false
          }
        ]
      });
      await page.waitForLoadState("networkidle");

      const questionRoot = page.locator(".sd-row");
      await compareScreenshot(page, questionRoot, "image-in-row.png");
    });
  });
});