import { frameworks, url, initSurvey, axeContext, axeOptions } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";
const title = "text";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check signature", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            "type": "signaturepad",
            "name": "damage-illustration",
            "signatureWidth": 824,
            "signatureHeight": 684,
            "signatureAutoScaleEnabled": true,
            "backgroundImage": "https://api.surveyjs.io/private/Surveys/files?name=9c38f0ea-5f03-4120-9708-17e55f49aa19",
            "penColor": "#dd277f",
            "showPlaceholder": false
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});