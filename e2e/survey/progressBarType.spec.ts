import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "progressBarType";

const json_questions = {
  showProgressBar: "top",
  progressBarType: "questions",
  pages: [
    {
      elements: [
        {
          type: "text",
          isRequired: true,
          inputType: "email",
          name: "q1"
        },
        { type: "text", name: "q2" }
      ]
    },
    {
      elements: [
        { type: "text", isRequired: true, name: "q3" },
        { type: "text", name: "q4" }
      ]
    }
  ]
};

const json_requiredQuestions = {
  showProgressBar: "top",
  progressBarType: "requiredQuestions",
  pages: [
    {
      elements: [
        {
          type: "text",
          isRequired: true,
          inputType: "email",
          name: "q1"
        },
        { type: "text", name: "q2" }
      ]
    },
    {
      elements: [
        { type: "text", isRequired: true, name: "q3" },
        { type: "text", name: "q4" }
      ]
    }
  ]
};

const json_toc = {
  showTOC: true,
  pages: [
    {
      elements: [
        { type: "text", inputType: "email", name: "q1" },
        { type: "text", name: "q2" }
      ]
    },
    {
      elements: [
        { type: "text", isRequired: true, name: "q3" },
        { type: "text", name: "q4" }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("progressBarType:questions", async ({ page }) => {
      await initSurvey(page, framework, json_questions);

      await expect(page.locator("span").filter({ hasText: "Answered 0/4 questions", visible: true })).toHaveCount(1);
      await page.locator("input[type=email]").fill("stub@gmail.com");
      await page.keyboard.press("Tab");
      await expect(page.locator("span").filter({ hasText: "Answered 1/4 questions", visible: true })).toHaveCount(1);
    });

    test("progressBarType:requiredQuestions", async ({ page }) => {
      await initSurvey(page, framework, json_requiredQuestions);

      await expect(page.locator("span").filter({ hasText: "Answered 0/2 questions", visible: true })).toHaveCount(1);
      await page.locator("input[type=email]").fill("stub@gmail.com");
      await page.keyboard.press("Tab");
      await expect(page.locator("span").filter({ hasText: "Answered 1/2 questions", visible: true })).toHaveCount(1);
    });

    test("navigation:toc", async ({ page }) => {
      await initSurvey(page, framework, json_toc);

      const page1 = page.locator(".sv-list__item-body").filter({ hasText: "page1" });
      const page2 = page.locator(".sv-list__item-body").filter({ hasText: "page2" });

      await expect(page1).toBeVisible();
      await expect(page2).toBeVisible();
      await page2.click();
      await expect(page.locator("h5.sd-question__title").filter({ hasText: "q3" })).toBeVisible();
    });
  });
});