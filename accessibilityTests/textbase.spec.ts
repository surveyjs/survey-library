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
    test("axe check text", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            name: "name",
            type: "text",
            indent: 1
          },
          {
            "type": "text",
            "name": "question1",
            "title": "Username",
            "isRequired": true,
            "maxLength": 25
          },
          {
            name: "name",
            type: "text",
            title: "Question title",
            titleLocation: "hidden"
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });

    test("axe check multipletext", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "multipletext",
            "name": "register",
            "title": "Root Title",
            "items": [
              {
                "name": "username",
                "isRequired": true,
                "title": "Title 1",
                "maxLength": 10
              },
              {
                "name": "email",
                "title": "Title 2",
                "inputType": "email"
              },
              {
                type: "comment",
                name: "suggestions",
                title: "Comment"
              },
            ]
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});