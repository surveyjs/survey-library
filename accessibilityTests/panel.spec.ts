import { Page, test } from "@playwright/test";
import { frameworks, url, initSurvey, axeOptions } from "./helper";
import { injectAxe, checkA11y } from "axe-playwright";

const title = "Panel";

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check panel collapse/expand", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "title": "Panel 1",
                "state": "expanded",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1",
                  },
                ]
              },
              {
                "type": "panel",
                "name": "panel2",
                "title": "Panel 2",
                "state": "collapsed",
                "elements": [
                  {
                    "type": "text",
                    "name": "question2",
                  },
                ]
              }
            ]
          }
        ],
        "questionErrorLocation": "bottom"
      });
      await checkA11y(page, ".sd-question", { axeOptions });
    });
  });
});