import { frameworks, url, initSurvey, axeOptions, axeContext } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";
const title = "rating";

// Skip one minor case for listbox role in checkbox fieldset
// axeOptions["rules"]["aria-allowed-role"] = {
//   enabled: false
// };
frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check rating", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "rating",
                "name": "satisfaction-numeric",
                "title": "How satisfied are you with our product?",
                "description": "Numeric rating scale",
                "autoGenerate": false,
                "rateCount": 10,
                "rateValues": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              },
            ]
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check rating - stars", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "rating",
                "name": "satisfaction-stars",
                "title": "How satisfied are you with our product?",
                "description": "Star rating scale",
                "rateType": "stars",
                "rateCount": 10,
                "rateMax": 10,
                "displayMode": "buttons"
              }
            ]
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });

    test("axe check rating - smiles", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "rating",
                "name": "satisfaction-smileys-colored",
                "title": "How satisfied are you with our product?",
                "description": "Smiley rating with colored scale",
                "rateType": "smileys",
                "scaleColorMode": "colored",
                "rateCount": 10,
                "rateMax": 10,
                "displayMode": "buttons"
              }
            ]
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });

    test("axe check rating: required", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "rating",
                "name": "satisfaction-numeric",
                "title": "How satisfied are you with our product?",
                "description": "Numeric rating scale",
                "autoGenerate": false,
                "isRequired": true,
                "rateCount": 10,
                "rateValues": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              },
            ]
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});