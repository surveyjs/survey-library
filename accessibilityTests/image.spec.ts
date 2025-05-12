import { frameworks, url, initSurvey, axeTags, axeContext, axeOptions } from "./helper";
import { test } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";
const title = "image";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("check image", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            "type": "image",
            "name": "test",
            "imageLink": "https://surveyjs.io/Content/Images/V2/features-page/Full-Integration.png",
            "imageHeight": 330,
            "imageWidth": 800,
            "altText": "SurveyJS component integration"
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("check image youtube", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "image",
            "name": "test",
            "imageLink": "https://youtu.be/RAXo6pzOczQ",
            "imageHeight": 450,
            "imageWidth": 800
          }
        ],
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});