import { expect } from "@playwright/test";
import { frameworks, url, initSurvey, resetFocusToBody, compareScreenshot, baseTest as test } from "../e2e/helper";

const title = "Multipletext Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check multipletext question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "multipletext",
            name: "q1",
            minWidth: "768px",
            maxWidth: "768px",
            width: "768px",
            title: "Personal Information",
            items: [
              { name: "item1", title: "Full Name" },
              { name: "item2", title: "Email Address" },
              { name: "item3", title: "ID" },
            ]
          },
        ]
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "mutlipletext.png");
      await questionRoot.locator("input.sd-formbox__input").first().click();
      await compareScreenshot(page, questionRoot, "mutlipletext-focus.png");
    });

    test("Check multipletext question error", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        widthMode: "responsive",
        elements: [
          {
            type: "multipletext",
            name: "q1",
            minWidth: "1000px",
            maxWidth: "1000px",
            width: "1000px",
            colCount: 2,
            title: "Personal Information",
            items: [
              { name: "item1", isRequired: true, title: "Full Name" },
              { name: "item2", title: "Email Address" },
              { name: "item3", isRequired: true, title: "ID" }
            ]
          },
        ]
      });

      const questionRoot = page.locator(".sd-question");
      await page.click(".sd-navigation__complete-btn");
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "mutlipletext-error-top.png");
      await page.evaluate(() => { (window as any).survey.getAllQuestions()[0].itemErrorLocation = "bottom"; });
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "mutlipletext-error-bottom.png");
    });

    test("Check multipletext itemTitleWidth", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
          {
            type: "multipletext",
            name: "q1",
            itemTitleWidth: "400px",
            items: [
              { name: "item1", title: "A very long first item title" },
              { name: "item2", title: "A medium long title" },
              { name: "item3", title: "Short title" },
            ]
          },
        ]
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "mutlipletext-titlewidth.png");
    });

    test("Check multipletext narrow date item", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "multipletext",
                name: "question5",
                width: "65%",
                minWidth: "256px",
                maxWidth: "300px",
                items: [
                  {
                    name: "date",
                    inputType: "date",
                    title: "Date of birth"
                  }
                ]
              }
            ]
          }
        ],
        widthMode: "static",
        width: "860"
      });

      await compareScreenshot(page, page.locator(".sd-multipletext__item-container"), "small-multiple-text.png");
    });

    test("Check multipletext long unbreakable item title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "multipletext",
                name: "question3",
                maxWidth: "300px",
                title: "Participant details",
                items: [
                  {
                    name: "item",
                    title: "LongUnbreakableItem"
                  }
                ],
                itemTitleWidth: "100"
              }
            ]
          }
        ],
        widthMode: "static",
        width: "800px"
      });

      await compareScreenshot(page, page.locator(".sd-multipletext__item-container"), "long-string-short-space.png");
    });
  });
});