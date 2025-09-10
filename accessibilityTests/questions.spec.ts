import { frameworks, url, initSurvey, axeContext, axeOptions } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";
const title = "others";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check boolean", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "boolean",
            name: "bool",
            title: "Boolean",
            label: "Are you 21 or older?",
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check image", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "image",
            name: "banner",
            imageHeight: "300px",
            imageWidth: "450px",
            imageLink:
              "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check file", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "file",
            title: "File",
            name: "image",
            storeDataAsText: false,
            showPreview: true,
            imageWidth: 150,
            maxSize: 102400
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check errors", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "text",
            "isRequired": true,
            name: "text"
          },
        ]
      });
      await page.evaluate(() => {
        (window as any).survey.validate();
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});